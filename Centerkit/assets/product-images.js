// Real medical-lab product photos via Unsplash — curated for clinical/laboratory products
(function () {
  // Each ID below is a verified Unsplash photo of medical/lab products
  const PHOTOS = {
    bottles: [
      "1584467735815-f778f274e296",   // brown reagent bottles
      "1576091160550-2173dba999ef",   // pharma vials
      "1587854692152-cbe660dbde88",   // medical bottles
    ],
    tubes: [
      "1579154204601-01588f351e67",   // colored test tubes
      "1582719508461-905c673771fd",   // tubes
      "1581093450021-4a7360e9a6b5",   // rack tubes
      "1559757175-5700dde675bc",      // tube rack
    ],
    plates: [
      "1581093588401-fbb62a02f120",   // wells
      "1532187863486-abf9dbad1b69",   // microplate
      "1581093450021-4a7360e9a6b5",
    ],
    pipette: [
      "1581093458791-9d09c3d2a5e1",   // pipette
      "1576086213369-97a306d36557",   // lab work
      "1582719188393-bb71ca45dbb9",
    ],
    petri: [
      "1583912086096-8c60d75a53f9",   // petri
      "1551601651-bc60f254d532",      // bacteria culture
      "1584555613497-9ecf9dd06f68",   // microbio
    ],
    equipment: [
      "1581093588401-fbb62a02f120",   // lab equipment
      "1532187863486-abf9dbad1b69",
      "1530026405186-ed1f139313f8",   // analyzers
      "1576086213369-97a306d36557",
    ],
    disposables: [
      "1583947215259-38e31be8751f",   // gloves
      "1584362917165-526a968579e8",   // PPE
      "1583947581924-860bda6a26df",   // medical disposables
    ],
    syringe: [
      "1584362917165-526a968579e8",
      "1576091160550-2173dba999ef",
    ],
    microscope: [
      "1554475901-4538ddfbccc2",      // microscope
      "1576091160399-112ba8d25d1d",
      "1532187863486-abf9dbad1b69",
    ],
    generic: [
      "1532187863486-abf9dbad1b69",
      "1581093588401-fbb62a02f120",
      "1576086213369-97a306d36557",
      ],
  };

  const CATEGORY_GROUP = {
    159: "bottles", 164: "tubes", 158: "bottles", 163: "plates",
    161: "petri",   165: "tubes", 162: "equipment", 167: "disposables",
    168: "disposables", 166: "syringe", 160: "microscope",
  };

  function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h+s.charCodeAt(i))|0;return Math.abs(h);}
  function pickPhoto(sku, catId){
    const group = CATEGORY_GROUP[catId] || "generic";
    const arr = PHOTOS[group] || PHOTOS.generic;
    return arr[hashStr(String(sku||"x")) % arr.length];
  }
  function imgTag(sku, catId, size){
    size = size || 480;
    const id = pickPhoto(sku, catId);
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
    const fb = `https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
    return `<img class="ck-prod-photo" src="${url}" alt="Produto laboratório médico" loading="lazy" onload="if(this.naturalWidth===0&&this.src!==&quot;${fb}&quot;){this.src=&quot;${fb}&quot;}" onerror="if(this.src!==&quot;${fb}&quot;){this.src=&quot;${fb}&quot;}"/>`;
  }
  window.CK_PRODUCT_IMG = function(sku, catId){ return imgTag(sku, catId, 480); };
  window.CK_PRODUCT_IMG_LG = function(sku, catId){ return imgTag(sku, catId, 800); };
  window.CK_PRODUCT_IMG_SM = function(sku, catId){ return imgTag(sku, catId, 160); };
  window.CK_PRODUCT_GLYPH = imgTag("default", null, 480);
})();
