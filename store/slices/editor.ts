import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  BackgroundStyle,
  CardProps,
  CommonStyle,
  ImageProps,
  ImageStyle,
  Item,
  LayoutConfig,
  Section,
  SectionStyle,
  TextProps,
  TextStyle,
} from "../../components/types/common/layout";
import {
  Permission,
  TextEditStatus,
  UploadStatus,
} from "../../components/types/common/status";
import { createItem } from "../../utils/utils";

interface ProjectState {
  layouts: LayoutState[];
  uploadStatus: UploadStatusMap;
  textEditStatus: TextEditStatusMap;
  projectPermission: Permission;
  projectPublishUrl: string | null;
}

// 전체 레이아웃 데이터
export interface LayoutState {
  layoutId: string;
  sections: Section[];
  layoutStyle?: PageLayoutStyle;
}

export interface PageLayoutStyle {
  maxWidth?: string; // "1200px"
  padding?: string; // "0 20px"
  gapBetweenSections?: string; // "40px"
  backgroundColor?: string;
}

export const MAX_LAYOUT_VALUE = 4;
export type UploadStatusMap = { [itemKey: string]: UploadStatus };
export type TextEditStatusMap = { [itemKey: string]: TextEditStatus };

const createInitialState = (): ProjectState => ({
  layouts: [
    {
      layoutId: "init",
      sections: [],
    },
  ],
  uploadStatus: {},
  textEditStatus: {},
  projectPermission: "READ_ONLY",
  projectPublishUrl: null,
});

const layoutSlice = createSlice({
  name: "layouts",
  initialState: createInitialState(),
  reducers: {
    addSection: (
      state,
      { payload }: PayloadAction<{ newSection: Section }>
    ) => {
      const layout = state.layouts[0];
      layout.sections.push({
        ...payload.newSection,
        title: `섹션 ${state.layouts[0].sections.length + 1}`, // 기본 제목 추가
      });
    },
    deleteSection: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.layouts[0].sections = state.layouts[0].sections.filter(
        (section) => section.sectionKey !== payload.id
      );
    },
    updateSectionTitle: (
      state,
      { payload }: PayloadAction<{ sectionKey: string; title: string }>
    ) => {
      const section = state.layouts[0].sections.find(
        (section) => section.sectionKey === payload.sectionKey
      );
      if (section) {
        section.title = payload.title;
      }
    },
    addLayoutItem: (
      state,
      { payload }: PayloadAction<{ id: string; newItem: Item }>
    ) => {
      const sectionIndex = state.layouts[0].sections.findIndex(
        (section) => section.sectionKey === payload.id
      );

      if (sectionIndex === -1) return;
      if (
        state.layouts[0].sections[sectionIndex].items.length >= MAX_LAYOUT_VALUE
      )
        return;

      state.layouts[0].sections[sectionIndex].items.push(payload.newItem);
    },
    addImageToSection: (
      state,
      { payload }: PayloadAction<{ sectionKey: string }>
    ) => {
      const section = state.layouts[0].sections.find(
        (section) => section.sectionKey === payload.sectionKey
      );
      if (!section) return;
      if (section.items.length >= MAX_LAYOUT_VALUE) {
        toast.error("최대 4개까지 입력 가능합니다.");
        return;
      }
      section.items.push(createItem({ type: "img" }));
    },
    deleteLayoutItem(
      state,
      { payload }: PayloadAction<{ sectionId: string; itemId: string }>
    ) {
      const section = state.layouts[0].sections.find(
        (section) => section.sectionKey === payload.sectionId
      );
      if (!section) return;
      section.items = section.items.filter(
        (item) => item.id !== payload.itemId
      );
    },
    updateImageUrl(
      state,
      {
        payload,
      }: PayloadAction<{ sectionKey: string; itemId: string; imageUrl: string }>
    ) {
      const section = state.layouts[0].sections.find(
        (section) => section.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((item) => item.id === payload.itemId);
      if (item?.type === "img") {
        item.componentProps = {
          ...item.componentProps,
          ...{ url: payload.imageUrl },
        } as ImageProps;
      }
    },
    updateTextContent(
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        itemId: string;
        textContent: string;
      }>
    ) {
      const section = state.layouts[0].sections.find(
        (section) => section.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((item) => item.id === payload.itemId);
      if (item?.type === "text") {
        (item.componentProps as TextProps).text = payload.textContent;
      }
    },
    setLayoutData(state, { payload }: PayloadAction<{ layout: LayoutState }>) {
      state.layouts[0] = payload.layout;
    },
    setImageUploadStatus(
      state,
      {
        payload,
      }: PayloadAction<{ itemKey: string; status: Partial<UploadStatus> }>
    ) {
      const { itemKey, status } = payload;
      state.uploadStatus[itemKey] = {
        ...state.uploadStatus[itemKey],
        ...status,
      };
    },
    resetImageUploadStatus(
      state,
      { payload }: PayloadAction<{ itemKey: string }>
    ) {
      delete state.uploadStatus[payload.itemKey];
    },
    setAllImageUploadStatus(
      state,
      { payload }: PayloadAction<{ [itemKey: string]: UploadStatus }>
    ) {
      state.uploadStatus = payload;
    },
    resetLayoutState(state) {
      Object.assign(state, createInitialState());
    },
    updateTextStyle: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        itemId: string;
        style: Partial<TextStyle>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((i) => i.id === payload.itemId);
      if (item?.type === "text") {
        const current = item.componentProps as TextProps;
        current.textStyle = { ...current.textStyle, ...payload.style };
      }
    },
    updateImageStyle: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        itemId: string;
        style: Partial<ImageStyle>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((i) => i.id === payload.itemId);
      if (item?.type === "img") {
        const current = item.componentProps as ImageProps;
        current.imageStyle = { ...current.imageStyle, ...payload.style };
      }
    },
    updateSectionStyle: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        style: Partial<SectionStyle>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      if (section) {
        section.style = { ...section.style, ...payload.style };
      }
    },
    updateLayoutConfig: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        layout: Partial<LayoutConfig>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      if (section) {
        section.layout = { ...section.layout, ...payload.layout };
      }
    },
    addLayout: (
      state,
      {
        payload,
      }: PayloadAction<{
        layout: LayoutState;
      }>
    ) => {
      state.layouts[0] = payload.layout;
    },
    updateCommonStyle: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        itemId: string;
        style: Partial<CommonStyle>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((i) => i.id === payload.itemId);
      if (item) {
        item.commonStyle = { ...item.commonStyle, ...payload.style };
      }
    },
    updateSectionBackground: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        background: Partial<BackgroundStyle>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      if (section) {
        section.backgroundStyle = {
          ...section.backgroundStyle,
          ...payload.background,
        };
      }
    },
    updatePageLayoutStyle: (state, action) => {
      state.layouts[0].layoutStyle = {
        ...state.layouts[0].layoutStyle,
        ...action.payload,
      };
    },
    updateCardProps: (
      state,
      {
        payload,
      }: PayloadAction<{
        sectionKey: string;
        itemId: string;
        props: Partial<CardProps>;
      }>
    ) => {
      const section = state.layouts[0].sections.find(
        (s) => s.sectionKey === payload.sectionKey
      );
      const item = section?.items.find((i) => i.id === payload.itemId);
      if (item?.type === "card") {
        item.componentProps = {
          ...item.componentProps,
          ...payload.props,
        };
      }
    },
    setProjectPermission(
      state,
      action: PayloadAction<{ projectPermission: Permission }>
    ) {
      state.projectPermission = action.payload.projectPermission;
    },
    setProjectPublishUrl(
      state,
      action: PayloadAction<{ projectPublishUrl: string | null }>
    ) {
      state.projectPublishUrl = action.payload.projectPublishUrl;
    },
  },
});

export default layoutSlice;
export const {
  addSection,
  deleteSection,
  updateSectionTitle,
  addLayoutItem,
  addLayout,
  addImageToSection,
  deleteLayoutItem,
  updateImageUrl,
  updateTextContent,
  setLayoutData,
  setImageUploadStatus,
  resetImageUploadStatus,
  setAllImageUploadStatus,
  resetLayoutState,
  updateTextStyle,
  updateImageStyle,
  updateCommonStyle,
  updateSectionStyle,
  updateSectionBackground,
  updateCardProps,
  updateLayoutConfig,
  updatePageLayoutStyle,
  setProjectPermission,
  setProjectPublishUrl,
} = layoutSlice.actions;
