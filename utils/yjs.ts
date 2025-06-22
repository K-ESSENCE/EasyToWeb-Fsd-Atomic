import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {Awareness} from "y-protocols/awareness";
import {useRouter} from "next/navigation";

interface YjsConfig {
	roomName: string;
	accessToken: string;
	user: {
		id: string;
		name: string;
		color: string;
	};
	closeEvent:() => void
}

export const createYjsDocument = ({
	                                  roomName,
	                                  accessToken,
	                                  user,
	                                  closeEvent,
                                  }: YjsConfig) => {
	const doc = new Y.Doc();

	const provider = new WebsocketProvider(
			"ws://localhost:8080",
			// "wss://dev-api.easytoweb.store",
			"layout-modal-room",
			doc,
			{
				params: {
					roomName: roomName,
				},
				protocols: [`Authorization_${accessToken}`],
			}
	);

	// Yjs uploadStatus 맵 생성
	const uploadStatusMap = doc.getMap("uploadStatus");
	// Yjs textEditStatus 맵 생성
	const textEditStatusMap = doc.getMap("textEditStatus");
	// Yjs imageStyles 맵 생성
	const imageStylesMap = doc.getMap("imageStyles");
	// Yjs imageUrls 맵 생성
	const imageUrlsMap = doc.getMap("imageUrls");
	//  Yjs layout 맵 생성
	const sharedLayoutMap = doc.getMap("layoutDatas");

	provider.on("connection-close", (event) => {
		if (!event) {
			return;
		}

		console.error("WebSocket connection close:", event);
		// Handle specific error codes
		const error = event as unknown as {
			code: number;
			reason: string;
		};

		switch (error.code) {
			case 1002:
				console.error("Resource not found");
				break;
			case 1003:
				console.error("Invalid input value:", error.reason);
				error.reason = "Invalid input value:" + error.reason;
				break;
			case 1008:
				console.log("project not found or access Deny");
				break;
			case 1011:
				console.error("Internal server error");
				break;
			case 4401:
				console.error("Access token expired");
				break;
			case 1006:
				console.error("network connecting close");
				break;
			default:
				console.error("Unknown error:", error);
		}

		if (error.code !== 1006) closeEvent();
		if (error.reason) alert(error.reason);
	})

	// Handle WebSocket errors
	provider.on("connection-error", (event: Event) => {
		console.error("WebSocket connection error:", event);
		// Handle specific error codes
		const error = event as unknown as {
			code: number;
			message: string;
			errorFieldName?: string;
		};

		switch (error.code) {
			case 1002:
				console.error("Resource not found");
				break;
			case 1003:
				console.error("Invalid input value:", error.errorFieldName);
				break;
			case 1008:
				if (error.message === "PROJECT_NOT_FOUND") {
					console.error("Project not found");
				} else if (error.message === "USER_NOT_LOGIN") {
					console.error("User not logged in");
				} else if (error.message === "ACCESS_DENIED") {
					console.error("Access denied");
				}
				break;
			case 1011:
				console.error("Internal server error");
				break;
			case 4401:
				console.error("Access token expired");
				break;
			default:
				console.error("Unknown error:", error);
		}
	});

	// Set up awareness for user presence
	const awareness = provider.awareness;
	awareness.setLocalState({
		user: {
			id: user.id,
			name: user.name,
			color: user.color,
		},
		selection: {
			sectionKey: null,
			itemKey: null,
		},
	});

	return {
		doc,
		provider,
		awareness,
		uploadStatusMap,
		textEditStatusMap,
		imageStylesMap,
		imageUrlsMap,
		sharedLayoutMap,
	};
};

export const updateUserSelection = (
		awareness: Awareness,
		sectionKey: string | null,
		itemKey: string | null
) => {
	const currentState = awareness.getLocalState();
	if (currentState) {
		awareness.setLocalState({
			...currentState,
			selection: {
				sectionKey,
				itemKey,
			},
		});
	}
};

export const cleanupYjsProvider = (provider: WebsocketProvider) => {
	provider.awareness.setLocalState(null);
	provider.destroy();
};
