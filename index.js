// GIF Categories Plugin for Kettu / Bunny / Vendetta

"use strict";
  // src/index.tsx
  var vd = typeof bunny !== "undefined" && bunny || typeof vendetta !== "undefined" && vendetta || {};
  var {
    modules: { findByProps, findByDisplayName, findByName },
    patcher: { before, after, instead },
    storage: pluginStorage,
    ui: {
      alerts: { showConfirmationAlert },
      toasts: { showToast }
    }
  } = vd;
  var React = findByProps("createElement", "useEffect", "useState");
  var { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } = findByProps("View", "Text", "ScrollView");
  var _a, _b;
  var _modalMod = (_b = (_a = findByProps("openModal", "closeModal")) != null ? _a : findByProps("openLazy", "close")) != null ? _b : {};
  function openModal(key, render) {
    var _a2, _b2;
    ((_b2 = (_a2 = _modalMod.openModal) != null ? _a2 : _modalMod.openLazy) != null ? _b2 : noop)(key, render);
  }
  function closeModal(key) {
    var _a2, _b2;
    ((_b2 = (_a2 = _modalMod.closeModal) != null ? _a2 : _modalMod.close) != null ? _b2 : noop)(key);
  }
  function noop(..._args) {
  }
  function getStorage() {
    if (!pluginStorage.categories) pluginStorage.categories = {};
    return pluginStorage;
  }
  function saveCategory(cat) {
    getStorage().categories[cat.id] = cat;
  }
  function removeGifFromCategory(categoryId, gifUrl) {
    const cat = getStorage().categories[categoryId];
    if (!cat) return;
    cat.gifs = cat.gifs.filter((g) => g.url !== gifUrl);
    saveCategory(cat);
  }
  function deleteCategory(categoryId) {
    delete getStorage().categories[categoryId];
  }
  function makeCategoryId() {
    return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
  var C = {
    bg: "#1e1f22",
    surface: "#2b2d31",
    accent: "#5865f2",
    text: "#f2f3f5",
    muted: "#949ba4",
    danger: "#ed4245",
    border: "#3f4147"
  };
  var S = StyleSheet.create({
    container: {
      backgroundColor: C.bg,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      padding: 16,
      paddingBottom: 36
    },
    title: { color: C.text, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 4 },
    subtitle: { color: C.muted, fontSize: 12, textAlign: "center", marginBottom: 14 },
    input: {
      backgroundColor: C.surface,
      color: C.text,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: C.border
    },
    btn: { borderRadius: 8, paddingVertical: 12, alignItems: "center", marginBottom: 8 },
    btnAccent: { backgroundColor: C.accent },
    btnMuted: { backgroundColor: C.surface },
    btnText: { color: C.text, fontWeight: "600", fontSize: 15 },
    btnTextMuted: { color: C.muted, fontWeight: "600", fontSize: 15 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.surface,
      borderRadius: 10,
      padding: 12,
      marginBottom: 8
    },
    rowName: { color: C.text, fontSize: 15, fontWeight: "600", flex: 1 },
    rowMeta: { color: C.muted, fontSize: 12 },
    gifGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    gifTile: {
      width: 82,
      height: 82,
      margin: 3,
      borderRadius: 7,
      backgroundColor: C.surface,
      overflow: "hidden"
    },
    gifImg: { width: "100%", height: "100%", resizeMode: "cover" },
    empty: { color: C.muted, textAlign: "center", marginTop: 28, fontSize: 14, lineHeight: 22 },
    hint: { color: C.muted, fontSize: 11, textAlign: "center", marginVertical: 6 },
    catHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8
    },
    catTitle: { color: C.text, fontSize: 16, fontWeight: "700" },
    back: { color: C.accent, fontSize: 15 },
    del: { color: C.danger, fontSize: 13 },
    spacer: { height: 10 }
  });
  function openAddToCategorySheet(gif) {
    const KEY = "gif-category-add";
    function AddSheet() {
      const [screen, setScreen] = React.useState("choose");
      const [newName, setNewName] = React.useState("");
      const [, forceRender] = React.useReducer((n) => n + 1, 0);
      const cats = Object.values(getStorage().categories);
      function handleCreate() {
        const name = newName.trim();
        if (!name) {
          showToast("Name can't be empty", 0);
          return;
        }
        saveCategory({ id: makeCategoryId(), name, gifs: [gif] });
        showToast(`GIF added to "${name}"`, 1);
        closeModal(KEY);
      }
      function handleAddExisting(cat) {
        if (cat.gifs.some((g) => g.url === gif.url)) {
          showToast(`Already in "${cat.name}"`, 0);
          return;
        }
        cat.gifs.push(gif);
        saveCategory(cat);
        showToast(`Added to "${cat.name}"`, 1);
        closeModal(KEY);
      }
      if (screen === "create") {
        return /* @__PURE__ */ React.createElement(View, { style: S.container }, /* @__PURE__ */ React.createElement(Text, { style: S.title }, "New Category"), /* @__PURE__ */ React.createElement(Text, { style: S.subtitle }, "Give it a name, then tap Create."), /* @__PURE__ */ React.createElement(
          TextInput,
          {
            style: S.input,
            placeholder: "e.g. Reactions, Memes, Animals\u2026",
            placeholderTextColor: C.muted,
            value: newName,
            onChangeText: setNewName,
            autoFocus: true,
            returnKeyType: "done",
            onSubmitEditing: handleCreate
          }
        ), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [S.btn, S.btnAccent], onPress: handleCreate }, /* @__PURE__ */ React.createElement(Text, { style: S.btnText }, "Create & Add GIF")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [S.btn, S.btnMuted], onPress: () => setScreen("choose") }, /* @__PURE__ */ React.createElement(Text, { style: S.btnTextMuted }, "\u2190 Back")));
      }
      return /* @__PURE__ */ React.createElement(View, { style: S.container }, /* @__PURE__ */ React.createElement(Text, { style: S.title }, "Add GIF to Category"), gif.title ? /* @__PURE__ */ React.createElement(Text, { style: S.subtitle, numberOfLines: 1 }, gif.title) : null, cats.length > 0 ? /* @__PURE__ */ React.createElement(ScrollView, { style: { maxHeight: 280 }, showsVerticalScrollIndicator: false }, cats.map((cat) => {
        const already = cat.gifs.some((g) => g.url === gif.url);
        return /* @__PURE__ */ React.createElement(
          TouchableOpacity,
          {
            key: cat.id,
            style: [S.row, already ? { opacity: 0.45 } : null],
            onPress: () => handleAddExisting(cat),
            disabled: already
          },
          /* @__PURE__ */ React.createElement(Text, { style: S.rowName }, cat.name),
          /* @__PURE__ */ React.createElement(Text, { style: S.rowMeta }, already ? "done" : `${cat.gifs.length} GIF${cat.gifs.length !== 1 ? "s" : ""}`)
        );
      })) : /* @__PURE__ */ React.createElement(Text, { style: S.empty }, "No categories yet.", "\n", "Create your first one below!"), /* @__PURE__ */ React.createElement(View, { style: S.spacer }), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [S.btn, S.btnAccent], onPress: () => setScreen("create") }, /* @__PURE__ */ React.createElement(Text, { style: S.btnText }, "+ Create New Category")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [S.btn, S.btnMuted], onPress: () => closeModal(KEY) }, /* @__PURE__ */ React.createElement(Text, { style: S.btnTextMuted }, "Cancel")));
    }
    openModal(KEY, () => /* @__PURE__ */ React.createElement(AddSheet, null));
  }
  function openCategoriesBrowser() {
    const KEY = "gif-category-browser";
    function Browser() {
      var _a2;
      const [selectedId, setSelectedId] = React.useState(null);
      const [, forceRender] = React.useReducer((n) => n + 1, 0);
      const store = getStorage();
      const cats = Object.values(store.categories);
      const sel = selectedId ? (_a2 = store.categories[selectedId]) != null ? _a2 : null : null;
      function confirmDeleteCategory(cat) {
        showConfirmationAlert({
          title: "Delete Category",
          content: `Delete "${cat.name}"? (${cat.gifs.length} GIF${cat.gifs.length !== 1 ? "s" : ""} uncategorised \u2014 they stay in your Discord favourites.)`,
          confirmText: "Delete",
          confirmColor: "red",
          onConfirm() {
            deleteCategory(cat.id);
            if (selectedId === cat.id) setSelectedId(null);
            forceRender();
          }
        });
      }
      function confirmRemoveGif(catId, url) {
        showConfirmationAlert({
          title: "Remove GIF",
          content: "Remove from this category? It stays in your Discord favourites.",
          confirmText: "Remove",
          confirmColor: "red",
          onConfirm() {
            removeGifFromCategory(catId, url);
            forceRender();
          }
        });
      }
      if (sel) {
        return /* @__PURE__ */ React.createElement(View, { style: S.container }, /* @__PURE__ */ React.createElement(View, { style: S.catHeader }, /* @__PURE__ */ React.createElement(TouchableOpacity, { onPress: () => setSelectedId(null) }, /* @__PURE__ */ React.createElement(Text, { style: S.back }, "\u2190 All")), /* @__PURE__ */ React.createElement(Text, { style: S.catTitle }, sel.name), /* @__PURE__ */ React.createElement(TouchableOpacity, { onPress: () => confirmDeleteCategory(sel) }, /* @__PURE__ */ React.createElement(Text, { style: S.del }, "Delete"))), sel.gifs.length === 0 ? /* @__PURE__ */ React.createElement(Text, { style: S.empty }, "No GIFs in this category yet.", "\n", "Long-press any GIF to add it here.") : /* @__PURE__ */ React.createElement(ScrollView, { showsVerticalScrollIndicator: false }, /* @__PURE__ */ React.createElement(View, { style: S.gifGrid }, sel.gifs.map((gif) => /* @__PURE__ */ React.createElement(
          TouchableOpacity,
          {
            key: gif.url,
            style: S.gifTile,
            onLongPress: () => confirmRemoveGif(sel.id, gif.url)
          },
          /* @__PURE__ */ React.createElement(Image, { source: { uri: gif.src || gif.url }, style: S.gifImg })
        ))), /* @__PURE__ */ React.createElement(Text, { style: S.hint }, "Long-press a GIF to remove it")));
      }
      return /* @__PURE__ */ React.createElement(View, { style: [S.container, { minHeight: 300 }] }, /* @__PURE__ */ React.createElement(Text, { style: S.title }, "GIF Categories"), cats.length === 0 ? /* @__PURE__ */ React.createElement(Text, { style: S.empty }, "No categories yet.", "\n", "Long-press any GIF to create one!") : /* @__PURE__ */ React.createElement(ScrollView, { showsVerticalScrollIndicator: false }, cats.map((cat) => /* @__PURE__ */ React.createElement(
        TouchableOpacity,
        {
          key: cat.id,
          style: S.row,
          onPress: () => setSelectedId(cat.id),
          onLongPress: () => confirmDeleteCategory(cat)
        },
        /* @__PURE__ */ React.createElement(Text, { style: S.rowName }, cat.name),
        /* @__PURE__ */ React.createElement(Text, { style: S.rowMeta }, cat.gifs.length, " GIF", cat.gifs.length !== 1 ? "s" : "")
      )), /* @__PURE__ */ React.createElement(Text, { style: S.hint }, "Long-press a category to delete it")), /* @__PURE__ */ React.createElement(TouchableOpacity, { style: [S.btn, S.btnMuted], onPress: () => closeModal(KEY) }, /* @__PURE__ */ React.createElement(Text, { style: S.btnTextMuted }, "Close")));
    }
    openModal(KEY, () => /* @__PURE__ */ React.createElement(Browser, null));
  }
  function looksLikeGif(item) {
    var _a2, _b2, _c;
    if (!item || typeof item !== "object") return false;
    const url = (_c = (_b2 = (_a2 = item.url) != null ? _a2 : item.src) != null ? _b2 : item.gif_url) != null ? _c : "";
    return url.includes(".gif") || url.includes("tenor.com") || url.includes("giphy.com") || url.includes("media.discordapp");
  }
  function extractGif(value) {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const candidate = (_b2 = (_a2 = value == null ? void 0 : value.item) != null ? _a2 : value == null ? void 0 : value.gif) != null ? _b2 : value;
    if (!candidate || !looksLikeGif(candidate)) return null;
    return {
      url: (_e = (_d = (_c = candidate.url) != null ? _c : candidate.gif_url) != null ? _d : candidate.src) != null ? _e : "",
      src: (_i = (_h = (_g = (_f = candidate.src) != null ? _f : candidate.preview) != null ? _g : candidate.url) != null ? _h : candidate.gif_url) != null ? _i : "",
      title: (_k = (_j = candidate.title) != null ? _j : candidate.description) != null ? _k : "",
      width: candidate.width,
      height: candidate.height
    };
  }
  function addLongPressToElement(element, gif) {
    var _a2;
    if (!element || typeof element !== "object") return element;
    try {
      const prev = (_a2 = element.props) == null ? void 0 : _a2.onLongPress;
      return React.cloneElement(element, {
        onLongPress() {
          if (typeof prev === "function") prev();
          openAddToCategorySheet(gif);
        }
      });
    } catch (e) {
      return element;
    }
  }
  function deepInjectLongPress(element) {
    if (!element || typeof element !== "object") return element;
    try {
      const props = element.props;
      if (!props) return element;
      const gif = extractGif(props);
      if (gif) return addLongPressToElement(element, gif);
      if (props.children) {
        const children = props.children;
        const patched = Array.isArray(children) ? children.map(deepInjectLongPress) : deepInjectLongPress(children);
        return React.cloneElement(element, { children: patched });
      }
    } catch (e) {
    }
    return element;
  }
  var _patches = [];
  var index_default = {
    onLoad() {
      var _a2, _b2, _c, _d, _e;
      getStorage();
      const TILE_NAMES = [
        "GifPickerResultItem",
        "GifResult",
        "GifPickerResult",
        "TrendingGifResult",
        "GIFPickerResultItem"
      ];
      for (const name of TILE_NAMES) {
        try {
          const comp = (_a2 = findByDisplayName(name, { interop: false })) != null ? _a2 : findByName(name, { interop: false });
          if (!comp) continue;
          const key = "default" in comp ? "default" : name;
          _patches.push(
            after(key, comp, ([props], res) => {
              if (!res || !props) return res;
              const gif = extractGif(props);
              return gif ? addLongPressToElement(res, gif) : res;
            })
          );
        } catch (e) {
        }
      }
      const FAV_GIF_PICKER = (_c = (_b2 = findByDisplayName("GIFPicker", { interop: false })) != null ? _b2 : findByDisplayName("GifPicker", { interop: false })) != null ? _c : findByName("GifPicker", { interop: false });
      if (FAV_GIF_PICKER) {
        const key = "default" in FAV_GIF_PICKER ? "default" : "render";
        _patches.push(
          after(key, FAV_GIF_PICKER, (_args, res) => deepInjectLongPress(res))
        );
      }
      const FAV_NAMES = [
        "FavoriteGIFs",
        "FavouriteGIFs",
        "GIFFavorites",
        "GifFavorites",
        "FavoriteGifPicker"
      ];
      for (const name of FAV_NAMES) {
        try {
          const comp = (_d = findByDisplayName(name, { interop: false })) != null ? _d : findByName(name, { interop: false });
          if (!comp) continue;
          const key = "default" in comp ? "default" : "render";
          _patches.push(
            after(key, comp, (_args, res) => {
              if (!res) return res;
              return /* @__PURE__ */ React.createElement(View, { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(
                TouchableOpacity,
                {
                  style: {
                    backgroundColor: C.accent,
                    marginHorizontal: 12,
                    marginTop: 8,
                    marginBottom: 4,
                    borderRadius: 8,
                    paddingVertical: 9,
                    alignItems: "center"
                  },
                  onPress: openCategoriesBrowser
                },
                /* @__PURE__ */ React.createElement(Text, { style: { color: C.text, fontWeight: "700", fontSize: 14 } }, "Browse GIF Categories")
              ), res);
            })
          );
          break;
        } catch (e) {
        }
      }
      try {
        const FlatListMod = (_e = findByProps("flashScrollIndicators")) != null ? _e : findByDisplayName("FlatList", { interop: false });
        if (FlatListMod) {
          const key = "render" in FlatListMod ? "render" : "default" in FlatListMod ? "default" : null;
          if (key) {
            _patches.push(
              before(key, FlatListMod, ([props]) => {
                if (!(props == null ? void 0 : props.renderItem) || !Array.isArray(props.data)) return;
                if (!looksLikeGif(props.data[0])) return;
                const orig = props.renderItem;
                props.renderItem = (info) => {
                  const el = orig(info);
                  const gif = extractGif(info.item);
                  return gif ? addLongPressToElement(el, gif) : el;
                };
              })
            );
          }
        }
      } catch (e) {
      }
    },
    onUnload() {
      _patches.forEach((up) => up());
      _patches.length = 0;
    }
  };

module.exports = index_default;
