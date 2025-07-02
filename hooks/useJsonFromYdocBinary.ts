import {useEffect, useState} from "react";
import * as Y from "yjs";
import {LayoutState} from "../store/slices/editor";

interface YDocJson {
	layouts: LayoutState[];
}

const useJsonFromYDocBinary = (base64Data: string | null) => {
	const [json, setJson] = useState<YDocJson | null>(null);

	useEffect(() => {
		if (!base64Data){
			setJson(null);
			return;
		}

		try {
			const binary = atob(base64Data);
			const byteArray = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				byteArray[i] = binary.charCodeAt(i);
			}

			const ydoc = new Y.Doc();
			Y.applyUpdate(ydoc, byteArray);

			const sharedLayoutMap = ydoc.getMap("layoutData");
			const json = sharedLayoutMap.toJSON() as LayoutState;
			setJson({layouts:[json]});

		} catch (e) {
			console.error("Yjs 문서 생성 실패:", e);
		}
	}, [base64Data]);

	return { json };
};

export default useJsonFromYDocBinary;