import type { Template } from "shared";

export class TemplateStore {
  private static _store?: TemplateStore;

  private templates: Map<string, Template>;

  private constructor() {
    this.templates = new Map();
  }

  static get(): TemplateStore {
    if (!TemplateStore._store) {
      TemplateStore._store = new TemplateStore();
    }

    return TemplateStore._store;
  }

  getTemplates() {
    return [...this.templates.values()];
  }

  addTemplate(template: Template) {
    this.templates.set(template.id, template);
  }

  deleteTemplate(templateId: string) {
    this.templates.delete(templateId);
  }

  toggleTemplateRole(templateId: string, roleId: string) {
    const template = this.templates.get(templateId);
    if (template) {
      const currRule = template.rules.find((rule) => {
        return rule.type === "RoleRule" && rule.roleId === roleId;
      });

      if (currRule) {
        currRule.hasAccess = !currRule.hasAccess;
      } else {
        template.rules.push({
          type: "RoleRule",
          roleId,
          hasAccess: true,
          status: "Untested"
        });
      }
    }

    return template;
  }

  toggleTemplateUser(templateId: string, userId: string) {
    const template = this.templates.get(templateId);
    if (template) {
      const currRule = template.rules.find((rule) => {
        return rule.type === "UserRule" && rule.userId === userId;
      });

      if (currRule) {
        currRule.hasAccess = !currRule.hasAccess;
      } else {
        template.rules.push({
          type: "UserRule",
          userId,
          hasAccess: true,
          status: "Untested"
        });
      }
    }

    return template;
  }
}
