import {useEffect, useState} from "react";
import * as Y from "yjs";
import {LayoutData, SectionData} from "../components/types/common/layoutStyle";
import {ImageStyleMap} from "../store/slices/layouts";

interface YDocJson {
	sections: SectionData[];
	imageStyles: ImageStyleMap;
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

			const imageStylesMap = ydoc.getMap("imageStyles");
			const sharedLayoutMap = ydoc.getMap("layoutDatas");

			const json = {
				imageStyles: imageStylesMap.toJSON() as ImageStyleMap,
				sections: (sharedLayoutMap.toJSON()?.sections ?? []) as SectionData[],
			};

			setJson(json);

		} catch (e) {
			console.error("Yjs 문서 생성 실패:", e);
		}
	}, [base64Data]);

	return { json };
};

export default useJsonFromYDocBinary;