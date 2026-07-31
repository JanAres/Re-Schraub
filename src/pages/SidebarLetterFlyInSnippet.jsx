// SidebarLetterFlyInSnippet.jsx
// True letter-by-letter fly-in needs the sidebar text to be split into spans.
// Use this helper inside your Products.jsx / sidebar render code.

function flyText(text, itemIndex = 0, className = "") {
  return (
    <span
      className={`sidebar-fly-word ${className}`}
      style={{ "--item-i": itemIndex }}
      aria-label={text}
    >
      {String(text).split("").map((char, letterIndex) => (
        <span
          key={`${char}-${letterIndex}`}
          className="sidebar-letter"
          style={{ "--letter-i": letterIndex }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Example replacements:

// 1) Section labels:
// <div className="minimal-catalog-section-label">
//   {flyText("KATALOGE", 0)}
// </div>
//
// <div className="minimal-catalog-section-label">
//   {flyText("INHALTSVERZEICHNIS", 0)}
// </div>

// 2) Catalog links:
// {catalogs.map((catalog, index) => (
//   <button className={`minimal-catalog-link ${active ? "active" : ""}`}>
//     {flyText(catalog.title, index)}
//   </button>
// ))}

// 3) Group/category links:
// {groups.map((group, index) => (
//   <button className={`minimal-catalog-group-link ${active ? "active" : ""}`}>
//     <span className="minimal-catalog-group-main">
//       <span className="minimal-catalog-group-name">
//         {flyText(group.name, index)}
//       </span>
//       {group.logo && <img className="minimal-catalog-group-logo" src={group.logo} alt="" />}
//     </span>
//     <span className="minimal-catalog-group-page">
//       {flyText(`Seite ${group.page}`, index)}
//     </span>
//   </button>
// ))}

export { flyText };
