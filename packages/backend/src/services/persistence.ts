import type { SDK } from "caido:plugin";
import type { Project } from "caido:utils";
import { SettingsStore } from "../stores/settings";

const getTablePrefix = async (sdk: SDK): Promise<string | null> => {
    const project = await sdk.projects.getCurrent();
    if (project === undefined) {
        return null;
    }

    return `${project.getId().toString()}_`;
}

export const handleProjectPersistence = async (sdk: SDK) => {
    sdk.console.error("Started to create tables");
    const tablePrefix = await getTablePrefix(sdk);
    if (tablePrefix === null) {
        return
    }
    const db = await sdk.meta.db();
    const settingsCreate = await db.exec(`CREATE TABLE IF NOT EXIST ${tablePrefix}settings (
            autoCaptureRequests TEXT CHECK (autoCaptureRequests IN ('off', 'all', 'inScope')),
            autoRunAnalysis BOOLEAN,
            deDuplicateHeaders TEXT, -- comma-separated list
            defaultFilterHTTPQL TEXT
    )`);
    sdk.console.log(settingsCreate);
    saveSettings(sdk)
}

export const handleProjectChange = (sdk: SDK, project: Project | null) => {
    sdk.console.log(`CHANGE ${project?.getName()}`);
    if (project === null) {
        return;
    }
    handleProjectPersistence(sdk);
}

export const saveSettings = async (sdk: SDK) => {
    const tablePrefix = await getTablePrefix(sdk);

    if (tablePrefix === null) {
        return
    }

    const db = await sdk.meta.db();

    const delRes = await db.exec(`DELETE * FROM ${tablePrefix}settings`);
    sdk.console.log(`Deleted settings ${delRes}`)
    const settings = SettingsStore.get().getSettings();
    const settingsStmt = await db.prepare(`
        INSERT INTO ${tablePrefix}settings (
            autoCaptureRequests,
            autoRunAnalysis,
            deDuplicateHeaders,
            defaultFilterHTTPQL
        ) VALUES (
            ?,
            ?,
            ?,
            ?
        )
    `);
    const res = await settingsStmt.run(
        settings.autoCaptureRequests,
        Number(settings.autoRunAnalysis),
        settings.deDuplicateHeaders.join(","),
        settings.defaultFilterHTTPQL,
    );
    sdk.console.log(`Insert result, ${res.changes}`);
}