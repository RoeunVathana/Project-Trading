import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "../frontend/components/ThemeContext";
import "./dashboard.css";

import AuthGate from "./components/AuthGate";
import DashboardOverview from "./components/DashboardOverview";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopbar from "./components/DashboardTopbar";
import RecordDialogs from "./components/RecordDialogs";
import ResourceSection from "./components/ResourceSection";
import {
  CATEGORY_COLORS,
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

const DashboardPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState(emptyRecords);
  const [loading, setLoading] = useState(true);
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

  const loadData = useCallback(async () => {
    setLoading(true);
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
    ];

    const results = await Promise.allSettled(loaders.map(([, load]) => load()));
    const nextRecords = emptyRecords();
    const issues = [];
    results.forEach((result, index) => {
      const resource = loaders[index][0];
      if (result.status === "fulfilled") {
        nextRecords[resource] = result.value;
      } else {
        issues.push(
          `${RESOURCE_CONFIG[resource].title}: ${result.reason?.message || "request failed"}`,
        );
      }
    });
    setRecords(nextRecords);
    setLoadIssues(issues);
    setLoading(false);
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
    const term = search.trim().toLowerCase();
    if (!term || !activeConfig) return activeRecords;
    return activeRecords.filter((record) => {
      const machine = records.machines.find(
        (item) => item.id === record.machineId,
      );
      const category = records.categories.find(
        (item) => item.id === record.categoryId,
      );
      const searchable = [
        ...Object.values(record).map((value) => String(value ?? "")),
        machine?.name,
        machine?.model,
        category?.name,
        record.category?.name,
      ];
      return searchable.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [activeSection, activeConfig, records, search]);

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
        payload[field.name] = field.type === "number" ? Number(value) : value;
      }
    });

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
          ? `${config.endpoint}/${record.id}`
          : config.createEndpoint || config.endpoint,
        { method: record ? "PUT" : "POST", body, token },
      );
      if (resource === "users" && record?.id === account?.id && savedResult.data) {
        setAccount(savedResult.data);
      }
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
      await requestApi(`${config.endpoint}/${record.id}`, {
        method: "DELETE",
        token,
      });
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
    const machine = records.machines.find(
      (item) => item.id === Number(machineId),
    );
    return machine
      ? `${machine.name} · ${machine.model}`
      : `Machine #${machineId}`;
  };

  const renderCell = (resource, key, record) => {
    if (resource === "users" && key === "name") {
      return displayAccountName(record, `User #${record.id}`);
    }
    if (key === "category") {
      return (
        record.category?.name ||
        records.categories.find((item) => item.id === record.categoryId)
          ?.name ||
        "—"
      );
    }
    if (key === "machine") return machineName(record.machineId);
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
          {record.fileName || "Open PDF"}
        </a>
      ) : (
        "—"
      );
    }
    if (key === "fileSize") return bytesLabel(record.fileSize);
    if (key === "status")
      return (
        <span className={`status-pill status-${record.status}`}>
          {record.status || "—"}
        </span>
      );
    const value = record[key];
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
              loading={loading}
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
              key={`${activeSection}:${search}`}
              activeSection={activeSection}
              activeConfig={activeConfig}
              filteredRecords={filteredRecords}
              loading={loading}
              search={search}
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
