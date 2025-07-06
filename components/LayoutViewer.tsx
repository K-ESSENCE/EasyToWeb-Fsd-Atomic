import { FULL_API_URL } from "../shared/api/axios";
import { LayoutState } from "../store/slices/editor";
import React from "react";

export interface LayoutViewerProps {
  layouts: LayoutState[];
}

const LayoutViewer = ({ layouts }: LayoutViewerProps) => {
  const layoutState = layouts[0];
  const layoutStyle = layoutState.layoutStyle;
  const sections = layoutState.sections;

  const wrapperStyle: React.CSSProperties = {
    maxWidth: layoutStyle?.maxWidth || "100%",
    padding: layoutStyle?.padding || "2rem 1.5rem",
    backgroundColor: layoutStyle?.backgroundColor,
    display: "flex",
    flexDirection: "column",
    gap: layoutStyle?.gapBetweenSections || "1.5rem",
  };

  return (
    <div
      className="flex flex-col transition-all duration-200 min-h-0 overflow-y-auto mb-[80px]"
      style={wrapperStyle}
    >
      {sections.map((section, key) => {
        const layout = section.layout || {};
        const style = section.style || {};
        const bg = section.backgroundStyle || {};

        const sectionStyle: React.CSSProperties = {
          display:
            layout.type === "flex"
              ? "flex"
              : layout.type === "grid"
                ? "grid"
                : undefined,
          gridTemplateColumns:
            layout.type === "grid" && layout.columns
              ? `repeat(${layout.columns}, 1fr)`
              : undefined,
          flexDirection: layout.type === "flex" ? "row" : undefined,
          justifyContent:
            layout.justifyContent ||
            (layout.align === "center"
              ? "center"
              : layout.align === "right"
                ? "flex-end"
                : "flex-start"),
          alignItems: layout.alignItems || "center",
          gap: layout.gap ? `${layout.gap}px` : undefined,
          height: layout.height,
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          backgroundColor: bg.backgroundColor,
          backgroundImage: bg.backgroundImage
            ? `url(${bg.backgroundImage})`
            : undefined,
          backgroundSize: bg.backgroundSize,
          backgroundPosition: bg.backgroundPosition,
          backgroundRepeat: bg.backgroundRepeat,
          transition: "all 0.3s ease",
        };

        return (
          <div
            key={key}
            className="p-4 rounded-md transition-all duration-150 ease-in-out"
          >
            <section
              className="transition-all duration-400 w-full"
              style={sectionStyle}
            >
              {section.items.map((item) => {
                if (item.type === "text") {
                  const textProps =
                    item.componentProps as import("./types/common/layout").TextProps;
                  const textStyle = textProps?.textStyle || {};
                  const commonStyle = item.commonStyle || {};

                  const style: React.CSSProperties = {
                    fontSize: textStyle.size,
                    color: textStyle.color,
                    fontWeight: textStyle.bold ? "bold" : "normal",
                    fontStyle: textStyle.italic ? "italic" : "normal",
                    textDecoration: textStyle.underline ? "underline" : "none",
                    textAlign: textStyle.align,
                    lineHeight: textStyle.lineHeight,
                    letterSpacing: textStyle.letterSpacing,
                    fontFamily: textStyle.fontFamily,
                    width: commonStyle.width,
                    height: commonStyle.height,
                    margin: commonStyle.margin,
                    padding: commonStyle.padding,
                    borderRadius: commonStyle.borderRadius,
                    backgroundColor: commonStyle.backgroundColor,
                    minHeight: "1.5em",
                    minWidth: "1.5em",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    outline: "none",
                  };

                  return (
                    <div
                      key={item.id}
                      className="w-full h-full overflow-hidden"
                    >
                      <div className="w-full">
                        <div style={style} className="text-gray-800">
                          {textProps?.text ?? ""}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === "img") {
                  const imageProps =
                    item.componentProps as import("./types/common/layout").ImageProps;
                  const imageStyle = imageProps?.imageStyle || {};
                  const commonStyle = item.commonStyle || {};

                  const labelStyle: React.CSSProperties = {
                    width: commonStyle.width || "200px",
                    height: commonStyle.height || "160px",
                    margin: commonStyle.margin,
                    padding: commonStyle.padding,
                    backgroundColor: commonStyle.backgroundColor || "#f9f9f9",
                    borderRadius:
                      commonStyle.borderRadius ||
                      `${imageStyle.borderRadius ?? 0}px`,
                    borderColor: imageStyle.borderColor || "#e5e7eb",
                    borderWidth: imageStyle.borderWidth ?? 0,
                    borderStyle: imageStyle.borderStyle || "dashed",
                    boxShadow: imageStyle.boxShadow || "none",
                    aspectRatio: imageStyle.aspectRatio || undefined,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                    minWidth: "150px",
                    minHeight: "150px",
                  };

                  const imageStyleOnly: React.CSSProperties = {
                    width: "100%",
                    height: "100%",
                    objectFit: imageStyle.objectFit || "cover",
                    borderRadius: `${imageStyle.borderRadius ?? 0}px`,
                    opacity: imageStyle.opacity ?? 1,
                  };

                  return (
                    <label
                      key={item.id}
                      htmlFor={item.id}
                      className="relative"
                      style={labelStyle}
                    >
                      {imageProps?.url && (
                        <img
                          src={`${FULL_API_URL}${imageProps.url}`}
                          alt="업로드 이미지"
                          style={imageStyleOnly}
                        />
                      )}
                    </label>
                  );
                }

                // 지원하지 않는 타입 안내
                return (
                  <div key={item.id} className="text-sm text-gray-400">
                    지원되지 않는 타입입니다: {item.type}
                  </div>
                );
              })}
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default LayoutViewer;
