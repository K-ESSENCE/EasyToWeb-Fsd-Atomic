import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {Awareness} from "y-protocols/awareness";
import {apiHandler, BASE_API_URL, BASE_SOCKET_PROTOCOL} from "../shared/api/axios";
import html2canvas from "html2canvas";
import {upload} from "../hooks/useChunkedImageUpload";
import toast from "react-hot-toast";
import {LayoutState} from "../store/slices/editor";

export const messageCapture = 3;

interface YjsConfig {
	projectId: string;
	accessToken: string;
	user: {
		id: string;
		name: string;
		color: string;
	};
	closeEvent:() => void
}

export const createYjsDocument = ({
	                                  projectId,
	                                  accessToken,
	                                  user,
	                                  closeEvent,
                                  }: YjsConfig) => {
	const doc = new Y.Doc();

	const provider = new WebsocketProvider(
			BASE_SOCKET_PROTOCOL + BASE_API_URL,
			"layout-modal-room",
			doc,
			{
				params: {
					roomName: projectId,
				},
				protocols: [`Authorization_${accessToken}`],
			}
	);

	// Yjs uploadStatus 맵 생성
	const uploadStatusMap = doc.getMap("uploadStatus");
	// Yjs textEditStatus 맵 생성
	const textEditStatusMap = doc.getMap("textEditStatus");
	//  Yjs layout 맵 생성
	const sharedLayoutMap = doc.getMap("layoutData");


	provider.messageHandlers[messageCapture] = () => {
		captureAndDownload(projectId);
	}

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
		if (error.reason) toast.error(error.reason);
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

export const captureAndDownload = async (
		projectId:string
) => {
	const element = document.getElementById('project-panel');
	if (!element) {
		console.error('project-panel 요소를 찾을 수 없습니다.');
		return;
	}

	try {
		const canvas = await html2canvas(element, {
			useCORS: true, // 이미지 등 외부 리소스 허용
			allowTaint: true,
			scrollY: -window.scrollY, // 고정 위치 캡처
		});

		// canvas → Blob → File
		const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/png')
		);

		if (!blob) throw new Error('이미지 생성 실패');

		// File 생성
		const file = new File([blob], 'capture.png', {
			type: 'image/png',
			lastModified: Date.now(),
		});


		const {fileId} = await upload(file);
		if (fileId){
			await apiHandler.updateProjectThumbnail({id: projectId, thumbnailFileId: fileId});
		}


	} catch (error) {
		console.error('캡처 실패:', error);
	}
};

export const getTestDoc = () => {
	const content = "{\"sections\":[{\"sectionKey\":\"62c83084-69ee-40d9-90b1-58f02b5f9570\",\"title\":\"섹션 1\",\"layout\":{\"type\":\"grid\",\"columns\":3,\"gap\":16,\"height\":\"\",\"align\":\"center\"},\"style\":{\"padding\":\"0\",\"margin\":\"0 auto\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"8a4c4df8-f9a5-4ad5-b882-322ce1b2e67d\",\"type\":\"text\",\"componentProps\":{\"text\":\"\uD83E\uDDE9 CRDT 란 무엇인가\",\"textStyle\":{\"size\":\"24px\",\"bold\":true}},\"commonStyle\":{\"height\":\"\",\"padding\":\"0\",\"margin\":\"0\"}}]},{\"sectionKey\":\"59edc766-dfdd-43d8-a7b3-b067771db137\",\"title\":\"섹션 2\",\"layout\":{\"type\":\"flex\",\"columns\":3,\"gap\":16,\"height\":\"auto\",\"align\":\"left\",\"alignItems\":\"flex-start\"},\"style\":{\"padding\":\"16px\",\"margin\":\"0 auto\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"bdfd0e11-e0ec-4ebe-9bf0-1a26b0374e89\",\"type\":\"img\",\"commonStyle\":{\"width\":\"auto\",\"height\":\"100%\",\"borderRadius\":\"8px\"},\"componentProps\":{\"url\":\"/api/file/f04b3e45-cb0b-47a1-866e-8ad5f7e665c5\",\"imageStyle\":{\"borderRadius\":0,\"borderColor\":\"#ccc\",\"borderWidth\":0,\"borderStyle\":\"none\",\"objectFit\":\"fill\"}}},{\"id\":\"792f306a-336e-4d56-8113-14275a4d9c04\",\"type\":\"text\",\"componentProps\":{\"text\":\"CRDT(Conflict‑Free Replicated Data Types)는 충돌 없는 복제 데이터 타입을 뜻하며, 여러 사용자 또는 기기에서 동시에 동작해도 순서와 무관하게 동일한 최종 상태로 수렴할 수 있도록 설계된 자료 구조입니다.\\n이 기술은 2006년경 처음 등장했으며, 서버의 중재 없이 각 노드(사용자)가 독립적으로 수정한 내용을 보내고, 암호화된 병합 과정을 통해 중앙 서버 없이도 작동 가능합니다.\\n\\n예를 들어, 텍스트에 문자를 삽입할 때는 특정 인덱스 기반이 아니라 고유 ID를 기반으로 처리하여, A와 B가 동시에 삽입되더라도 항상 동일한 위치로 병합합니다.\\n또한 복제된 데이터가 최신 상태인지 확인할 필요 없이, 반복 병합 후에도 동일한 결과를 보장합니다.\\n\",\"textStyle\":{\"size\":\"16px\"}},\"commonStyle\":{\"borderRadius\":\"8px\",\"padding\":\"16px\",\"margin\":\"\"}}]},{\"sectionKey\":\"d48db45d-cd41-41f0-83b0-b5d708fe4416\",\"title\":\"섹션 3\",\"layout\":{\"type\":\"flex\",\"columns\":3,\"gap\":0,\"height\":\"auto\",\"align\":\"left\"},\"style\":{\"padding\":\"0\",\"margin\":\"0 auto\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"53ffa52c-c3af-4ab3-9298-1ce052707df5\",\"type\":\"text\",\"componentProps\":{\"text\":\"⏱️ CRDT의 원리\\n\",\"textStyle\":{\"bold\":true,\"size\":\"24px\"}},\"commonStyle\":{\"margin\":\"0\",\"padding\":\"0\"}}]},{\"sectionKey\":\"aacf4193-e27c-460f-85ec-efae4b22c146\",\"title\":\"섹션 4\",\"layout\":{\"type\":\"flex\",\"columns\":3,\"gap\":16,\"height\":\"auto\",\"align\":\"center\",\"alignItems\":\"flex-start\"},\"style\":{\"padding\":\"16px\",\"margin\":\"0 auto\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"5e484b07-5a82-4488-88bf-958a3d33445c\",\"type\":\"text\",\"componentProps\":{\"text\":\"1. 고유 위치 예약\\n같은 위치에 문자를 삽입할 때, 예를 들어 0.6과 0.8 사이에 들어가야 한다면, 새로운 ID를 0.7로 생성하여 충돌 없이 병합합니다 .\\n\\n2. 병합 연산의 교환성\\nCRDT 병합 연산은 교환법칙을 따르므로, 메시지가 도착한 순서를 자유롭게 섞어도 결과는 동일합니다 .\\n\\n3. 서버 없이 동작 가능\\nOT처럼 중심 서버 없이도 되며, P2P와 오프라인 사용 시에도 일관성 보장이 가능합니다 .\\n\\n4. 병합 이후 동일 상태 수렴\\n최종적으로 같은 수의 업데이트만 받으면 언제든 동일한 상태가 유지되도록 설계됩니다.\\n\"},\"commonStyle\":{\"padding\":\"16px\",\"borderRadius\":\"8px\",\"height\":\"100%\"}},{\"id\":\"65496898-dd93-4924-ba45-e1c685a9a665\",\"type\":\"img\",\"commonStyle\":{\"width\":\"auto\",\"height\":\"100%\",\"borderRadius\":\"8px\"},\"componentProps\":{\"url\":\"/api/file/ab973870-f775-4cd4-91a6-8b2b357f7ace\",\"imageStyle\":{\"borderRadius\":0,\"borderColor\":\"#ccc\",\"borderWidth\":0,\"borderStyle\":\"none\"}}}]},{\"sectionKey\":\"8f570259-2159-4704-a185-0ace48c404f9\",\"title\":\"섹션 6\",\"layout\":{\"type\":\"flex\",\"columns\":3,\"gap\":16,\"height\":\"auto\",\"align\":\"center\"},\"style\":{\"padding\":\"0\",\"margin\":\"0\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"a8dd43d5-f39a-467d-af7a-24a2f100a834\",\"type\":\"img\",\"commonStyle\":{\"width\":\"100%\",\"height\":\"350px\"},\"componentProps\":{\"url\":\"/api/file/04ae4b80-5071-4ecb-896d-8365a7c75002\",\"imageStyle\":{\"borderRadius\":0,\"borderColor\":\"#ccc\",\"borderWidth\":0,\"borderStyle\":\"none\"}}}]},{\"sectionKey\":\"7bb25437-73fb-4c9c-873a-70cabd3be896\",\"title\":\"섹션 6\",\"layout\":{\"type\":\"flex\",\"columns\":3,\"gap\":16,\"height\":\"auto\",\"align\":\"left\",\"alignItems\":\"flex-start\"},\"style\":{\"padding\":\"0\",\"margin\":\"0 auto\",\"borderRadius\":\"8px\"},\"backgroundStyle\":{},\"items\":[{\"id\":\"26bde12b-d6e4-4d6e-b201-763281efca97\",\"type\":\"img\",\"commonStyle\":{\"width\":\"400px\",\"height\":\"300px\",\"borderRadius\":\"8px\"},\"componentProps\":{\"url\":\"/api/file/7fb49e70-a473-499d-9862-91143d3ee041\",\"imageStyle\":{\"borderRadius\":0,\"borderColor\":\"#ccc\",\"borderWidth\":0,\"borderStyle\":\"none\"}}},{\"id\":\"97f676f2-2b79-438e-bd50-c17968969b68\",\"type\":\"text\",\"componentProps\":{\"text\":\"CRDT는 자료 단위(size)에 기반한 O(N log N) 또는 O(log N) 성능 접근이 가능한 반면, OT는 일반적으로 히스토리 기반으로 더 무거워질 수 있다는 주장도 있습니다.\\n그러나 실제로는 구현 방식에 따라 OT도 충분히 최적화 가능하며, CRDT도 tombstone 관리나 구조 overhead로 복잡도가 높아질 수 있습니다.\\n게다가 Rich‑Text처럼 의도 지향적 작업이 많을 경우, OT 방식이 사용자 의도를 더 잘 유지한다는 평가를 받습니다 \"}}]}],\"layoutStyle\":{\"maxWidth\":\"1200px\"}}"
	return JSON.parse(content)
}