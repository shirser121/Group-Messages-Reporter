const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const {url, authorization, groupsIds} = config;

const headers = {
	'Content-Type': 'application/json', // Set the content type to plain text
	Authorization: authorization
};

const client = new Client({
	authStrategy: new LocalAuth({ clientId: 'WAPOST' }),
	puppeteer: {
		headless: true,
		args: [
			'--no-sandbox', // Add this option to fix sandbox-related issues in some environments
			'--disable-setuid-sandbox', // Add this option to fix sandbox-related issues in some environments
		],
		defaultViewport: null, // Set this to null to have full page screenshots
		font: 'Arial, "Noto Sans Hebrew", "Noto Sans", sans-serif', // Add Hebrew fonts to the list
	}
});


client.on('qr', qr => {
	qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
	console.log('BOT ready!');

});

client.on('dialog', async dialog => {
	console.log("Refresh popup just dismissed")
	await dialog.dismiss()
});

client.on('error', () => {
	client.destroy().then(() => client.initialize());
	console.log('pupage error... Client is ready again!');
});


client.on('authenticated', () => {
	console.log('WAFP Authenticated');
});

client.on('auth_failure', function () {
	console.error('Erorr: Authentication failed.');
});

client.on('change_state', state => {
	console.log('State change: ', state);
});

client.on('disconnected', (reason) => {
	console.log('Client Disconnected', reason);
	client.initialize().then();
});

client.on('message', async (msg) => {
	console.log("message received");
	let chat = await msg.getChat();

	if(chat.isGroup && (groupsIds.includes(chat.id._serialized) || groupsIds.length === 0)){
		const requestBody = {
			group_id: chat.id._serialized,
			group_name: chat.name,
			message: msg.body,
			phone_number: msg.author.replace('@c.us', ''),
			type: 'message'
		}

		const resultData = await sendPostRequest(requestBody);
		if (resultData.react) {
			await msg.react(resultData.react);
		}
	}
});

client.on('group_join', async (notification) => {
	console.log("group_join");
	const group = await notification.getChat();

	const amIJoined = notification.recipientIds.includes(client.info.wid._serialized);

	const requestBody = {
		newMembers: notification.recipientIds.map((member) => member.replace('@c.us', '')),
		joinOrAdded: notification.type,
		group_id: notification.chatId,
		group_name: group.name,
		amIJoined: amIJoined,
		allParticipants: group.participants.map((participant) => participant.id.user),
		type: 'group_join'
	}
	await sendPostRequest(requestBody);
});

client.on('group_leave', async (notification) => {
	console.log("group_leave");
	const group = await notification.getChat();

	const amILeave = notification.recipientIds.includes(client.info.wid._serialized);

	const requestBody = {
		leaveMembers: notification.recipientIds.map((member) => member.replace('@c.us', '')),
		leaveOrKicked: notification.type,
		group_id: notification.chatId,
		group_name: group.name,
		amILeave,
		allParticipants: group.participants.map((participant) => participant.id.user),
		type: 'group_leave'
	}
	await sendPostRequest(requestBody);
});

client.on('group_membership_request', async (notification) => {
	console.log("group_membership_request");
	const group = await notification.getChat();

	const requestBody = {
		requester: notification.author.replace('@c.us', ''),
		group_id: notification.chatId,
		group_name: group.name,
		type: 'group_membership_request'
	}
	const resultData = await sendPostRequest(requestBody);

	if (resultData.approve) {
		await client.approveGroupMembershipRequests(notification.chatId, {
			requesterIds: [notification.author]
		});
	}
	else if (resultData.reject) {
		await client.rejectGroupMembershipRequests(notification.chatId, {
			requesterIds: [notification.author]
		});
	}
});

async function sendPostRequest(requestBody) {
	console.log(requestBody);
	try {
		const response = await axios.post(url, requestBody, {headers});
		console.log(response.data);
		return response.data;
	}
	catch (error) {
		console.error('Error:', error?.data);
		return {
			status: 'error',
			error: error?.data
		}
	}
}

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


client.initialize().then();
