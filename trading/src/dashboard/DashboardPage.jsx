import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../frontend/components/ThemeContext";
import { clearCachedJson } from "../frontend/apiCache";
import "./dashboard.css";

import AuthGate from "./components/AuthGate";
import DashboardOverview from "./components/DashboardOverview";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopbar from "./components/DashboardTopbar";
import RecordDialogs from "./components/RecordDialogs";
import ResourceSection from "./components/ResourceSection";
import {
  CATEGORY_COLORS,
  RESOURCE_KEYS,
  RESOURCE_CONFIG,
  emptyRecords,
} from "./dashboardConfig";
import {
  TOKEN_KEY,
  fetchAllMachines,
  requestApi,
  savedToken,
} from "./dashboardApi";
import {
  bytesLabel,
  defaultForm,
  displayAccountName,
  publicFileUrl,
  recordTitle,
} from "./dashboardUtils";

const toCategorySlug = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "category";

const DashboardPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState(emptyRecords);
  const [loading, setLoading] = useState(true);
  const [loadingResources, setLoadingResources] = useState(() => new Set(RESOURCE_KEYS));
  const [loadIssues, setLoadIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [imageTarget, setImageTarget] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(null);
  const [token, setToken] = useState(savedToken);
  const [account, setAccount] = useState(null);
  const [authChecking, setAuthChecking] = useState(() => Boolean(savedToken()));
  const [accountMode, setAccountMode] = useState("login");
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    identifier: "",
    password: "",
    profileImage: null,
  });
  const deferredSearch = useDeferredValue(search);
  const loadGenerationRef = useRef(0);

  const loadData = useCallback(async () => {
    const loadGeneration = loadGenerationRef.current + 1;
    loadGenerationRef.current = loadGeneration;
    setLoading(true);
    setLoadingResources(new Set(RESOURCE_KEYS));
    const loaders = [
      ["machines", () => fetchAllMachines(token)],
      [
        "categories",
        () =>
          requestApi("/api/categories", { token }).then(
            (result) => result.data || [],
          ),
      ],
      [
        "gallery",
        () =>
          requestApi("/api/machine-galleries", { token }).then(
            (result) => result.data || [],
          ),
      ],
      [
        "specs",
        () =>
          requestApi("/api/machine-specs", { token }).then(
            (result) => result.data || [],
          ),
      ],
      [
        "pdfs",
        () =>
          requestApi("/api/machine-pdfs", { token }).then(
            (result) => result.data || [],
          ),
      ],
      [
        "users",
        () =>
          requestApi("/api/users", { token }).then(
            (result) => result.data || [],
          ),
      ],
      ["huawei", () => requestApi("/api/huawei", { token }).then((result) => result.data || [])],
      ["huaweiCategories", () => requestApi("/api/huawei-categories", { token }).then((result) => result.data || [])],
      ["huaweiImages", () => requestApi("/api/huawei-product-images", { token }).then((result) => result.data || [])],
      ["huaweiPdfs", () => requestApi("/api/huawei-product-pdfs", { token }).then((result) => result.data || [])],
    ];

    const coreResourceKeys = new Set(["machines", "categories", "gallery", "pdfs"]);
    const coreLoaders = loaders.filter(([resource]) => coreResourceKeys.has(resource));
    const backgroundLoaders = loaders.filter(([resource]) => !coreResourceKeys.has(resource));
    const issues = [];

    const applyResults = (results, scopedLoaders) => {
      if (loadGeneration !== loadGenerationRef.current) return false;

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const resource = scopedLoaders[index][0];
          issues.push(
            `${RESOURCE_CONFIG[resource].title}: ${result.reason?.message || "request failed"}`,
          );
        }
      });

      setRecords((currentRecords) => {
        const nextRecords = { ...currentRecords };
        results.forEach((result, index) => {
          const resource = scopedLoaders[index][0];
          if (result.status === "fulfilled") {
            nextRecords[resource] = result.value;
          }
        });
        return nextRecords;
      });
      setLoadIssues([...issues]);
      setLoadingResources((currentResources) => {
        const nextResources = new Set(currentResources);
        scopedLoaders.forEach(([resource]) => nextResources.delete(resource));
        return nextResources;
      });
      return true;
    };

    const corePromise = Promise.allSettled(coreLoaders.map(([, load]) => load()));
    const backgroundPromise = Promise.allSettled(backgroundLoaders.map(([, load]) => load()));
    const coreResults = await corePromise;
    if (!applyResults(coreResults, coreLoaders)) return;
    setLoading(false);

    const backgroundResults = await backgroundPromise;
    applyResults(backgroundResults, backgroundLoaders);
  }, [token]);

  useEffect(() => {
    if (!token || !account) return;
    const timer = window.setTimeout(() => loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData, token, account]);

  useEffect(() => {
    if (!token) return;

    if (account) return;

    let active = true;
    const checkingTimer = window.setTimeout(() => setAuthChecking(true), 0);
    requestApi("/api/users/me", { token })
      .then((result) => {
        if (!active) return;
        setAccount(result.data);
        setAuthChecking(false);
      })
      .catch(() => {
        if (!active) return;
        try {
          window.localStorage.removeItem(TOKEN_KEY);
        } catch {
          // Authentication can still be cleared for this page session.
        }
        setToken("");
        setAccount(null);
        setRecords(emptyRecords());
        setLoadIssues([]);
        setAuthChecking(false);
      });

    return () => {
      active = false;
      window.clearTimeout(checkingTimer);
    };
  }, [token, account]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const activeConfig = RESOURCE_CONFIG[activeSection];
  const categoryStats = useMemo(
    () =>
      records.categories
        .map((category) => ({
          ...category,
          machineCount: records.machines.filter(
            (machine) => Number(machine.categoryId) === Number(category.id),
          ).length,
          viewCount: records.machines
            .filter((machine) => Number(machine.categoryId) === Number(category.id))
            .reduce((total, machine) => total + Number(machine.viewCount || 0), 0),
        }))
        .sort((left, right) => right.machineCount - left.machineCount),
    [records.categories, records.machines],
  );
  const topCategoryStats = useMemo(
    () =>
      [...categoryStats].sort(
        (left, right) =>
          right.viewCount - left.viewCount || right.machineCount - left.machineCount,
      ),
    [categoryStats],
  );
  const machinesById = useMemo(
    () => new Map(records.machines.map((machine) => [machine.id, machine])),
    [records.machines],
  );
  const categoriesById = useMemo(
    () => new Map(records.categories.map((category) => [category.id, category])),
    [records.categories],
  );
  const huaweiProductsById = useMemo(
    () => new Map(records.huawei.map((product) => [product.id, product])),
    [records.huawei],
  );
  const huaweiCategoriesById = useMemo(
    () => new Map(records.huaweiCategories.map((category) => [category.id, category])),
    [records.huaweiCategories],
  );
  const searchIndex = useMemo(() => {
    const index = {};

    RESOURCE_KEYS.forEach((resource) => {
      index[resource] = records[resource].map((record) => {
        const machine = machinesById.get(record.machineId);
        const category = categoriesById.get(record.categoryId);
        const product = huaweiProductsById.get(record.productId);
        const parentCategory = huaweiCategoriesById.get(record.parentId);
        const searchable = [
          ...Object.values(record).map((value) => String(value ?? "")),
          machine?.name,
          machine?.model,
          category?.name,
          record.category?.name,
          product?.productName,
          product?.modelCode,
          parentCategory?.name,
        ];

        return {
          record,
          text: searchable.filter(Boolean).join(" ").toLowerCase(),
        };
      });
    });

    return index;
  }, [categoriesById, huaweiCategoriesById, huaweiProductsById, machinesById, records]);
  const largestCategoryViewCount = Math.max(
    1,
    ...topCategoryStats.map((category) => category.viewCount),
  );
  const categoryTotal = categoryStats.reduce(
    (total, category) => total + category.machineCount,
    0,
  );
  const categoryDonutBackground = useMemo(() => {
    if (!categoryTotal)
      return "conic-gradient(var(--theme-surface-3) 0deg 360deg)";
    let start = 0;
    const segments = categoryStats
      .filter((category) => category.machineCount > 0)
      .map((category, index) => {
        const end = start + (category.machineCount / categoryTotal) * 360;
        const segment = `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} ${start}deg ${end}deg`;
        start = end;
        return segment;
      });
    return `conic-gradient(${segments.join(", ")})`;
  }, [categoryStats, categoryTotal]);
  const filteredRecords = useMemo(() => {
    const activeRecords = activeConfig ? records[activeSection] : [];
    const term = deferredSearch.trim().toLowerCase();
    if (!term || !activeConfig) return activeRecords;
    return (searchIndex[activeSection] || [])
      .filter(({ text }) => text.includes(term))
      .map(({ record }) => record);
  }, [activeSection, activeConfig, deferredSearch, records, searchIndex]);

  const setCurrentSection = (section, options = {}) => {
    setActiveSection(section);
    setSearch("");
    if (options.closeSidebar !== false) setSidebarOpen(false);
  };

  const requireSignIn = () => {
    if (token) return true;
    setNotice({
      type: "error",
      message: "Sign in to create, update, or delete records.",
    });
    return false;
  };

  const openCreate = (resource) => {
    if (!requireSignIn()) return;
    setActiveSection(resource);
    setForm(defaultForm(RESOURCE_CONFIG[resource]));
    setDialog({ resource, record: null });
  };

  const openEdit = (resource, record) => {
    if (!requireSignIn()) return;
    setForm(defaultForm(RESOURCE_CONFIG[resource], record));
    setDialog({ resource, record });
  };

  const openDelete = (resource, record) => {
    if (!requireSignIn()) return;
    setDeleteTarget({ resource, record });
  };

  const openView = (resource, record) => {
    setViewTarget({ resource, record });
  };

  const openImageView = (image) => {
    if (image?.src) setImageTarget(image);
  };

  const submitRecord = async (event) => {
    event.preventDefault();
    if (!dialog || !requireSignIn()) return;
    const { resource, record } = dialog;
    const config = RESOURCE_CONFIG[resource];
    const payload = {};
    const fileUploads = [];

    config.fields.forEach((field) => {
      const value = form[field.name];
      if (field.type === "file") {
        if (value) fileUploads.push([field.apiField, value]);
        if (field.clearField && form[field.clearField]) payload[field.clearField] = "true";
      } else if (value !== "" && value !== undefined && value !== null) {
        const normalizedValue = field.normalize === "lowercase" && typeof value === "string"
          ? value.toLowerCase()
          : value;
        payload[field.name] = field.type === "number" ? Number(normalizedValue) : normalizedValue;
      }
    });

    // Slugs remain an internal database key, but are generated from the name
    // so dashboard users no longer need to maintain a separate slug field.
    if (resource === "huaweiCategories" && form.name) {
      payload.slug = toCategorySlug(form.name);
    }

    if (resource === "huawei") {
      // Keep internal catalog fields automatic so the form stays focused on
      // the product information dashboard users actually maintain.
      payload.slug = record?.slug || toCategorySlug(form.modelCode || form.productName);
      payload.status = record?.status || "PUBLISHED";
    }

    if (!record) {
      const missingRequired = config.fields.find((field) => {
        if (field.type === "file")
          return field.requiredOnCreate && !form[field.name];
        return (field.required || field.requiredOnCreate) && !String(form[field.name] || "").trim();
      });
      if (missingRequired) {
        setNotice({
          type: "error",
          message: `${missingRequired.label} is required.`,
        });
        return;
      }
    }

    let body = payload;
    if (fileUploads.length) {
      body = new FormData();
      Object.entries(payload).forEach(([key, value]) =>
        body.append(key, value),
      );
      fileUploads.forEach(([key, file]) => body.append(key, file));
    }

    setBusy(true);
    try {
      const savedResult = await requestApi(
        record
          ? `${config.endpoint}/${config.recordPath ? config.recordPath(record) : record.id}`
          : config.createEndpoint || config.endpoint,
        { method: record ? "PUT" : "POST", body, token },
      );
      if (resource === "users" && record?.id === account?.id && savedResult.data) {
        setAccount(savedResult.data);
      }
      clearCachedJson();
      setDialog(null);
      setNotice({
        type: "success",
        message: `${config.singular} ${record ? "updated" : "created"}.`,
      });
      await loadData();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to save changes.",
      });
    } finally {
      setBusy(false);
    }
  };

  const removeRecord = async () => {
    if (!deleteTarget || !requireSignIn()) return;
    const { resource, record } = deleteTarget;
    const config = RESOURCE_CONFIG[resource];
    setBusy(true);
    try {
      await requestApi(`${config.endpoint}/${config.recordPath ? config.recordPath(record) : record.id}`, {
        method: "DELETE",
        token,
      });
      clearCachedJson();
      setDeleteTarget(null);
      setNotice({ type: "success", message: `${config.singular} deleted.` });
      await loadData();
    } catch (error) {
      setDeleteTarget(null);
      setNotice({
        type: "error",
        message: error.message || "Unable to delete this record.",
      });
    } finally {
      setBusy(false);
    }
  };

  const submitAccount = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (accountMode === "register") {
        const registrationBody = new FormData();
        registrationBody.append("name", accountForm.name);
        registrationBody.append("email", accountForm.email);
        registrationBody.append("password", accountForm.password);
        if (accountForm.profileImage)
          registrationBody.append("image", accountForm.profileImage);
        await requestApi("/api/users/register", {
          method: "POST",
          body: registrationBody,
          token,
        });
      }

      const loginResult = await requestApi("/api/users/login", {
        method: "POST",
        body:
          accountMode === "register"
            ? { email: accountForm.email, password: accountForm.password }
            : {
                identifier: accountForm.identifier,
                password: accountForm.password,
              },
        token,
      });
      const nextToken = loginResult.data.token;
      try {
        window.localStorage.setItem(TOKEN_KEY, nextToken);
      } catch {
        // The token remains usable for this session if local storage is blocked.
      }
      setToken(nextToken);
      setAccount(loginResult.data.user);
      setAccountForm({
        name: "",
        email: "",
        identifier: "",
        password: "",
        profileImage: null,
      });
      setNotice({ type: "success", message: "Signed in successfully." });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to sign in.",
      });
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Clear the in-memory session even if storage is unavailable.
    }
    setToken("");
    setAccount(null);
    setRecords(emptyRecords());
    setLoadIssues([]);
    setActiveSection("overview");
    setSearch("");
    setDialog(null);
    setDeleteTarget(null);
    setNotice({ type: "success", message: "Signed out." });
  };

  const machineName = (machineId) => {
    const machine = machinesById.get(Number(machineId));
    return machine
      ? `${machine.name} · ${machine.model}`
      : `Machine #${machineId}`;
  };

  const huaweiProductName = (productId) => {
    const product = huaweiProductsById.get(Number(productId));
    return product ? `${product.productName} - ${product.modelCode}` : `Product #${productId}`;
  };

  const huaweiCategoryName = (categoryId) => {
    const category = huaweiCategoriesById.get(Number(categoryId));
    return category?.name || `Category #${categoryId}`;
  };

  const renderCell = (resource, key, record) => {
    if (resource === "users" && key === "name") {
      return displayAccountName(record, `User #${record.id}`);
    }
    if (key === "category") {
      return (
        record.category?.name ||
        categoriesById.get(record.categoryId)?.name ||
        "—"
      );
    }
    if (key === "machine") return machineName(record.machineId);
    if (key === "parent") return record.parent?.name || (record.parentId ? huaweiCategoryName(record.parentId) : "-");
    if (key === "product") return record.product?.productName ? `${record.product.productName} - ${record.product.modelCode}` : huaweiProductName(record.productId);
    if (resource === "specs" && key === "section") {
      return record.section || "General";
    }
    if (resource === "specs" && key === "label") {
      return record.label || record.specName || "—";
    }
    if (resource === "specs" && key === "value") {
      return record.value || record.specValue || "—";
    }
    if (resource === "specs" && key === "sortOrder") {
      return record.sortOrder ?? 0;
    }
    if (key === "video") {
      return record.video ? (
        <a
          className="dashboard-video-link"
          href={publicFileUrl(record.video)}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          Watch video
        </a>
      ) : (
        <span className="table-muted">No video</span>
      );
    }
    if (key === "image") {
      const path = resource === "machines"
        ? record.image
        : resource === "users"
          ? record.profileImage
          : record.imageUrl;
      return path ? (
        <img
          className={`dashboard-thumb ${resource === "users" ? "dashboard-user-thumb" : ""}`}
          src={publicFileUrl(path)}
          alt={resource === "users" ? `${record.name || record.email || "User"} profile` : ""}
        />
      ) : (
        resource === "users" ? (
          <span className="dashboard-user-avatar-fallback" aria-label={`${record.name || "User"} profile placeholder`}>
            {(record.name || record.email || "U").slice(0, 1).toUpperCase()}
          </span>
        ) : (
          <span className="table-muted">No image</span>
        )
      );
    }
    if (key === "galleryCount") return record.gallery?.length ?? 0;
    if (key === "specCount") return record.specs?.length ?? 0;
    if (key === "document") {
      return record.filePath ? (
        <a
          className="dashboard-file-link"
          href={publicFileUrl(record.filePath)}
          target="_blank"
          rel="noreferrer"
        >
          {record.fileName || record.originalFileName || "Open PDF"}
        </a>
      ) : (
        "—"
      );
    }
    if (key === "fileUrl" || key === "filePath") {
      const filePath = record[key];
      return filePath ? (
        <a className="dashboard-file-link" href={publicFileUrl(filePath)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          Open file
        </a>
      ) : "-";
    }
    if (key === "fileSize") return bytesLabel(record.fileSize);
    if (key === "fileSizeBytes") return bytesLabel(record.fileSizeBytes);
    if (key === "status")
      return (
        <span className={`status-pill status-${record.status}`}>
          {record.status || "—"}
        </span>
      );
    const value = record[key];
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value === null || value === undefined || value === ""
      ? "—"
      : String(value);
  };

  if (!token || !account || authChecking) {
    return (
      <AuthGate
        checking={authChecking || Boolean(token && !account)}
        accountMode={accountMode}
        setAccountMode={setAccountMode}
        accountForm={accountForm}
        setAccountForm={setAccountForm}
        submitAccount={submitAccount}
        busy={busy}
        error={notice?.type === "error" ? notice.message : ""}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }
  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        activeSection={activeSection}
        setCurrentSection={setCurrentSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        loadIssues={loadIssues}
        account={account}
      />
      <div className="dashboard-main">
        <DashboardTopbar
          account={account}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          search={search}
          setSearch={setSearch}
          theme={theme}
          toggleTheme={toggleTheme}
          signOut={signOut}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="dashboard-content">
          {loadIssues.length > 0 && (
            <div className="dashboard-api-alert" role="status">
              <strong>Some API data could not be loaded.</strong>
              <span>{loadIssues.join(" · ")}</span>
              <button type="button" onClick={loadData}>
                Retry
              </button>
            </div>
          )}
          {activeSection === "overview" ? (
            <DashboardOverview
              records={records}
              loading={loading || loadingResources.has(activeSection)}
              categoryStats={categoryStats}
              topCategoryStats={topCategoryStats}
              categoryTotal={categoryTotal}
              categoryDonutBackground={categoryDonutBackground}
              largestCategoryViewCount={largestCategoryViewCount}
              openCreate={openCreate}
              setCurrentSection={setCurrentSection}
            />
          ) : (
            <ResourceSection
              activeSection={activeSection}
              activeConfig={activeConfig}
              filteredRecords={filteredRecords}
              loading={loading}
              search={deferredSearch}
              loadData={loadData}
              renderCell={renderCell}
              recordTitle={recordTitle}
              onView={(record) => openView(activeSection, record)}
              onImageView={openImageView}
              onCreate={() => openCreate(activeSection)}
              onEdit={(record) => openEdit(activeSection, record)}
              onDelete={(record) => openDelete(activeSection, record)}
            />
          )}{" "}
        </main>
      </div>
      {notice && (
        <div
          className={`dashboard-toast toast-${notice.type}`}
          role={notice.type === "error" ? "alert" : "status"}
        >
          <span>{notice.type === "success" ? "✓" : "!"}</span>
          {notice.message}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}
      <RecordDialogs
        dialog={dialog}
        form={form}
        setForm={setForm}
        records={records}
        busy={busy}
        onSave={submitRecord}
        onClose={() => setDialog(null)}
        viewTarget={viewTarget}
        onCloseView={() => setViewTarget(null)}
        imageTarget={imageTarget}
        onCloseImage={() => setImageTarget(null)}
        onImageView={openImageView}
        renderCell={renderCell}
        deleteTarget={deleteTarget}
        onCancelDelete={() => setDeleteTarget(null)}
        onConfirmDelete={removeRecord}
      />{" "}
    </div>
  );
};

export default DashboardPage;
