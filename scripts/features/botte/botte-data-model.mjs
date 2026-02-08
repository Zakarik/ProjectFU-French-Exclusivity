import {MODULE} from "../../constants.mjs";

/**
 * @extends projectfu.RollableClassFeatureDataModel
 * @property {string} posture
 * @property {html} description
 */
const posture = {
	duelliste: 'FU-FREX.botte.duelliste',
	pilier: 'FU-FREX.botte.pilier',
	dupe: 'FU-FREX.botte.dupe',
};

const activeBotte = "botte.active"

export class BotteDataModel extends projectfu.ClassFeatureDataModel {

    static defineSchema() {
		const { StringField, HTMLField, BooleanField } = foundry.data.fields;
		return {
			posture: new StringField({
				initial: 'dupe',
				nullable: false,
				blank: true,
				choices: Object.keys(posture),
			}),
			description:new HTMLField(),
			active:new BooleanField({initial:false}),
		};
	}

	static get template() {
		return "projectfu-french-ex.botte.sheet";
	}

	static get previewTemplate() {
		return "projectfu-french-ex.botte.preview";
	}

	static get translation() {
		return 'FU-FREX.botte.label';
	}

	static async getAdditionalData(model) {
		// Provide any additional data needed for the template rendering
		return {
			posture,
			enrichedDescription: await TextEditor.enrichHTML(model.description),
			active: model.active,
		};
	}

	static async roll(model, item) {
		const actor = model.parent.parent.actor;
		if (!actor) {
			return;
		}
		const data = {
			posture: model.posture,
			description: await TextEditor.enrichHTML(model.description),
		};

		const speaker = ChatMessage.implementation.getSpeaker({ actor: actor });
		const chatMessage = {
			speaker,
			flavor: await renderTemplate('systems/projectfu/templates/chat/chat-check-flavor-item.hbs', model.parent.parent),
			content: await renderTemplate('modules/projectfu-french-ex/templates/botte/botte-chat-message.hbs', data),
			flags: { [projectfu.SYSTEM]: { [projectfu.Flags.ChatMessage.Item]: item } },
		};

		ChatMessage.create(chatMessage);
	}

	transferEffects() {
		return this.active ?? false;
	}

    /**
     * Action definition, invoked by sheets when 'data-action' equals the method name and no action defined on the sheet matches that name.
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    async toggleActiveBotte(event, target) {
		await this.item.update({['system.data.active']:!this.active});
    }
}