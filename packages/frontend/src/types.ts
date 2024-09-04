import type { Caido } from "@caido/sdk-frontend";
import type { API } from "backend";
import type { AnalysisResult, Settings, Template } from "shared";
import type { Role, User } from "shared";

export type CaidoSDK = Caido<API>;

export type SelectionState =
  | { type: "None" }
  | { type: "Loading"; templateId: string; userId: string | undefined }
  | { type: "Error"; templateId: string; userId: string | undefined }
  | {
      type: "Success";
      templateId: string;
      userId: string | undefined;
      request: {
        id: string;
        raw: string;
      };
      response?: {
        id: string;
        raw: string;
      }
    };

export type AnalysisState = { type: "Idle" } | { type: "Analyzing" };

export type TemplateState =
  | { type: "Idle" }
  | { type: "Loading" }
  | { type: "Error" }
  | {
      type: "Success";
      templates: Template[];
      results: AnalysisResult[];
      selectionState: SelectionState;
      analysisState: AnalysisState;
    };

export type RoleState =
  | { type: "Idle" }
  | { type: "Loading" }
  | { type: "Error" }
  | { type: "Success"; roles: Role[] };

export type UserState =
  | { type: "Idle" }
  | { type: "Loading" }
  | { type: "Error" }
  | { type: "Success"; users: User[] };

export type SettingsState =
  | { type: "Idle" }
  | { type: "Loading" }
  | { type: "Error" }
  | { type: "Success"; settings: Settings };
