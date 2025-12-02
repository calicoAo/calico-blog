/**
 * StructuredData 组件
 * 
 * 功能：
 * - 渲染结构化数据（JSON-LD）
 * - 支持多种 Schema.org 类型
 * 
 * @author lijingru
 * @created 2025-11-13
 */

interface StructuredDataProps {
  data: object | object[];
}

/**
 * 结构化数据组件
 */
export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
}

