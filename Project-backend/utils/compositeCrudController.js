const { logError } = require("../middlewares/LogError");

const parseId = (value) => {
  const id = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const serialize = (record, keyFields) => {
  const data = record.toJSON ? record.toJSON() : { ...record };
  if (data.id === undefined) data.id = keyFields.map((field) => data[field]).join("-");
  return data;
};

const createCompositeCrudController = ({
  model,
  resourceName,
  keyFields,
  fields,
  requiredFields,
  includes,
  order = [],
}) => {
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

      if (definition.type === "id") {
        const parsed = parseId(value);
        if (!parsed) return { error: `${field} must be a positive integer.` };
        values[field] = parsed;
      } else if (definition.type === "integer") {
        const parsed = typeof value === "string" && /^-?\d+$/.test(value) ? Number(value) : value;
        if (!Number.isSafeInteger(parsed) || parsed < (definition.min ?? 0)) {
          return { error: `${field} must be an integer greater than or equal to ${definition.min ?? 0}.` };
        }
        values[field] = parsed;
      } else if (definition.type === "boolean") {
        if (value === true || value === false) values[field] = value;
        else if (value === "true" || value === "false") values[field] = value === "true";
        else return { error: `${field} must be a boolean.` };
      } else if (definition.type === "string") {
        if (typeof value !== "string") return { error: `${field} must be a string${definition.nullable ? " or null" : ""}.` };
        const normalized = value.trim();
        if (requiredFields.includes(field) && !normalized) return { error: `${field} is required.` };
        if (definition.allowedValues && !definition.allowedValues.includes(normalized)) {
          return { error: `${field} must be one of: ${definition.allowedValues.join(", ")}.` };
        }
        values[field] = normalized;
      }
    }

    if (isCreate) {
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(values, field)) return { error: `${field} is required.` };
      }
    }
    if (!Object.keys(values).length) return { error: "Provide at least one supported field." };
    return { values };
  };

  const getKeyValues = (source) => {
    const values = {};
    for (const field of keyFields) {
      const parsed = parseId(source[field]);
      if (!parsed) return null;
      values[field] = parsed;
    }
    return values;
  };

  const findRecord = (source, options = {}) => {
    const where = getKeyValues(source);
    return where ? model.findOne({ where, ...options }) : null;
  };

  const reportError = (res, action, error) =>
    logError(`${resourceName}_${action}`, error, res, `Unable to ${action} ${resourceName.toLowerCase()}.`);

  return {
    getAll: async (_req, res) => {
      try {
        const records = await model.findAll({ include: includes, order });
        return res.status(200).json({ success: true, data: records.map((record) => serialize(record, keyFields)) });
      } catch (error) {
        return reportError(res, "retrieve", error);
      }
    },

    getById: async (req, res) => {
      try {
        const record = await findRecord(req.params, { include: includes });
        if (!record) return res.status(404).json({ success: false, message: `${resourceName} not found.` });
        return res.status(200).json({ success: true, data: serialize(record, keyFields) });
      } catch (error) {
        return reportError(res, "retrieve", error);
      }
    },

    create: async (req, res) => {
      try {
        const { values, error } = parsePayload(req.body, true);
        if (error) return res.status(400).json({ success: false, message: error });
        const record = await model.create(values);
        await record.reload({ include: includes });
        return res.status(201).json({ success: true, data: serialize(record, keyFields) });
      } catch (error) {
        return reportError(res, "create", error);
      }
    },

    update: async (req, res) => {
      try {
        const record = await findRecord(req.params);
        if (!record) return res.status(404).json({ success: false, message: `${resourceName} not found.` });
        const { values, error } = parsePayload(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        await record.update(values);
        await record.reload({ include: includes });
        return res.status(200).json({ success: true, data: serialize(record, keyFields) });
      } catch (error) {
        return reportError(res, "update", error);
      }
    },

    remove: async (req, res) => {
      try {
        const record = await findRecord(req.params);
        if (!record) return res.status(404).json({ success: false, message: `${resourceName} not found.` });
        await record.destroy();
        return res.status(200).json({ success: true, message: `${resourceName} deleted.` });
      } catch (error) {
        return reportError(res, "delete", error);
      }
    },
  };
};

module.exports = createCompositeCrudController;
