const { getImageUrl, removeImage } = require("./Upload");
const { logError } = require("../middlewares/LogError");

const parseId = (value) => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const createCrudController = ({
  model,
  resourceName,
  fields,
  requiredFields,
  parentModel,
  parentField,
  uploadedImageField,
  uploadedFileFields,
  removeUploadedFile,
  cleanupFileFields = [],
  removeStoredFile = removeImage,
}) => {
  const getRequestBody = (req) => {
    const body = { ...(req.body || {}) };
    if (req.file && typeof uploadedFileFields === "function") {
      Object.assign(body, uploadedFileFields(req.file));
    } else if (req.file && uploadedImageField) {
      body[uploadedImageField] = getImageUrl(req.file);
    }
    return body;
  };

  const discardUploadedFile = (req) => {
    if (!req.file) return;
    if (removeUploadedFile) return removeUploadedFile(req.file);
    removeImage(getImageUrl(req.file));
  };

  const parsePayload = (body, isCreate = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { error: "Request body must be a JSON object." };
    }

    const values = {};

    for (const [field, definition] of Object.entries(fields)) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) continue;

      const value = body[field];
      if (value === null && definition.nullable) {
        values[field] = null;
        continue;
      }

      if (definition.type === "string") {
        if (typeof value !== "string") {
          return {
            error: `${field} must be a string${definition.nullable ? " or null" : ""}.`,
          };
        }

        const normalized = value.trim();
        if (requiredFields.includes(field) && !normalized) {
          return { error: `${field} is required.` };
        }
        values[field] = normalized;
        continue;
      }

      const normalized = parseId(value);
      if (definition.type === "integer") {
        const integer =
          typeof value === "string" && /^-?\d+$/.test(value)
            ? Number(value)
            : value;
        if (!Number.isSafeInteger(integer) || integer < (definition.min ?? 0)) {
          return {
            error: `${field} must be an integer greater than or equal to ${definition.min ?? 0}.`,
          };
        }
        values[field] = integer;
        continue;
      }

      if (definition.type === "id") {
        if (!normalized) {
          return { error: `${field} must be a positive integer.` };
        }
        values[field] = normalized;
      }
    }

    if (isCreate) {
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(values, field)) {
          return { error: `${field} is required.` };
        }
      }
    }

    if (Object.keys(values).length === 0) {
      return { error: "Provide at least one supported field." };
    }

    return { values };
  };

  const validateParent = async (values) => {
    if (
      !parentModel ||
      !Object.prototype.hasOwnProperty.call(values, parentField)
    ) {
      return true;
    }
    return Boolean(await parentModel.findByPk(values[parentField]));
  };

  const reportError = (res, action, error) => {
    const loggerName = `${resourceName}_${action}`;
    const responseMessage = `Unable to ${action} ${resourceName.toLowerCase()}.`;
    return logError(loggerName, error, res, responseMessage);
  };

  return {
    getAll: async (req, res) => {
      try {
        const where = {};
        if (req.query.machineId !== undefined && req.query.machineId !== "") {
          const machineId = parseId(req.query.machineId);
          if (!machineId) {
            return res.status(400).json({
              success: false,
              message: "machineId must be a positive integer.",
            });
          }
          where.machineId = machineId;
        }

        const records = await model.findAll({
          where: Object.keys(where).length ? where : undefined,
          order: [["id", "DESC"]],
        });
        return res.status(200).json({ success: true, data: records });
      } catch (error) {
        return reportError(res, "retrieve", error);
      }
    },

    getById: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) {
          return res.status(400).json({
            success: false,
            message: "id must be a positive integer.",
          });
        }

        const record = await model.findByPk(id);
        if (!record) {
          return res
            .status(404)
            .json({ success: false, message: `${resourceName} not found.` });
        }
        return res.status(200).json({ success: true, data: record });
      } catch (error) {
        return reportError(res, "retrieve", error);
      }
    },

    create: async (req, res) => {
      try {
        const { values, error } = parsePayload(getRequestBody(req), true);
        if (error) {
          discardUploadedFile(req);
          return res.status(400).json({ success: false, message: error });
        }

        if (!(await validateParent(values))) {
          discardUploadedFile(req);
          return res
            .status(404)
            .json({ success: false, message: "Machine not found." });
        }
        const record = await model.create(values);
        return res.status(201).json({ success: true, data: record });
      } catch (databaseError) {
        discardUploadedFile(req);
        return reportError(res, "create", databaseError);
      }
    },

    update: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) {
          discardUploadedFile(req);
          return res.status(400).json({
            success: false,
            message: "id must be a positive integer.",
          });
        }

        const { values, error } = parsePayload(getRequestBody(req));
        if (error) {
          discardUploadedFile(req);
          return res.status(400).json({ success: false, message: error });
        }

        const record = await model.findByPk(id);
        if (!record) {
          discardUploadedFile(req);
          return res
            .status(404)
            .json({ success: false, message: `${resourceName} not found.` });
        }
        if (!(await validateParent(values))) {
          discardUploadedFile(req);
          return res
            .status(404)
            .json({ success: false, message: "Machine not found." });
        }

        const previousFiles = cleanupFileFields.map((field) => record[field]);
        await record.update(values);
        cleanupFileFields.forEach((field, index) => {
          if (previousFiles[index] && previousFiles[index] !== record[field]) {
            removeStoredFile?.(previousFiles[index]);
          }
        });
        return res.status(200).json({ success: true, data: record });
      } catch (databaseError) {
        discardUploadedFile(req);
        return reportError(res, "update", databaseError);
      }
    },

    remove: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) {
          return res.status(400).json({
            success: false,
            message: "id must be a positive integer.",
          });
        }

        const record = await model.findByPk(id);
        if (!record) {
          return res
            .status(404)
            .json({ success: false, message: `${resourceName} not found.` });
        }

        await record.destroy();
        cleanupFileFields.forEach((field) => removeStoredFile?.(record[field]));
        return res
          .status(200)
          .json({ success: true, message: `${resourceName} deleted.` });
      } catch (error) {
        return reportError(res, "delete", error);
      }
    },
  };
};

module.exports = createCrudController;
