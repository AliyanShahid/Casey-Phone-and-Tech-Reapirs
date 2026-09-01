"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  catalogSlug,
  deviceTypes,
  emptyCustomRepairCatalog,
  fileToDataUrl,
  readCustomRepairCatalog,
  subscribeCustomRepairCatalog,
  writeCustomRepairCatalog,
  type CustomDeviceType,
  type CustomRepairCatalog,
  type CustomRepairCategory,
  type CustomRepairModel
} from "@/lib/custom-repair-catalog";
import { allRepairDevices, repairOptions } from "@/lib/repair-flow-data";

type AdminCatalogTab = "models" | "repairs" | "prices";

const blankImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' rx='44' fill='%2315151b'/%3E%3Cpath d='M83 42h74a20 20 0 0 1 20 20v116a20 20 0 0 1-20 20H83a20 20 0 0 1-20-20V62a20 20 0 0 1 20-20Z' fill='none' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M129 76 101 130h24l-12 40 35-60h-24l5-34Z' fill='%23a3e635'/%3E%3C/svg%3E";

const emptyModelForm = {
  id: "",
  brandName: "Apple",
  deviceType: "Phone" as CustomDeviceType,
  seriesName: "iPhone Series",
  name: "",
  image: ""
};

const emptyRepairForm = {
  id: "",
  title: "",
  summary: "",
  warranty: "1 year warranty",
  badge: "starting from",
  basePrice: "",
  image: ""
};

const emptyPriceForm = {
  modelSlug: "",
  repairSlug: "",
  price: ""
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function money(value: number | null | undefined) {
  if (value == null) return "Quote";
  return `$${value.toLocaleString("en-AU", { maximumFractionDigits: 2 })}`;
}

export function AdminPricing() {
  const [catalog, setCatalog] = useState<CustomRepairCatalog>(emptyCustomRepairCatalog);
  const [tab, setTab] = useState<AdminCatalogTab>("models");
  const [modelForm, setModelForm] = useState(emptyModelForm);
  const [repairForm, setRepairForm] = useState(emptyRepairForm);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [priceBrandSlug, setPriceBrandSlug] = useState("");

  useEffect(() => {
    setCatalog(readCustomRepairCatalog());
    return subscribeCustomRepairCatalog(() => setCatalog(readCustomRepairCatalog()));
  }, []);

  const customBrands = useMemo(
    () => Array.from(new Set(catalog.models.map((model) => model.brandName))).sort(),
    [catalog.models]
  );

  const managedModels = useMemo(
    () => [
      ...allRepairDevices.map((model) => ({ ...model, adminManaged: false })),
      ...catalog.models.map((model) => ({
        brand: model.brandName,
        brandSlug: model.brandSlug,
        name: model.name,
        slug: model.slug,
        type: model.deviceType,
        image: model.image,
        adminManaged: true
      }))
    ],
    [catalog.models]
  );

  const managedRepairs = useMemo(
    () => [
      ...repairOptions.map((repair) => ({ ...repair, adminManaged: false })),
      ...catalog.repairCategories.map((repair) => ({
        id: repair.id,
        slug: repair.slug,
        title: repair.title,
        icon: repair.title.slice(0, 3).toUpperCase(),
        summary: repair.summary,
        price: repair.basePrice,
        warranty: repair.warranty,
        badge: repair.badge,
        image: repair.image,
        adminManaged: true
      }))
    ],
    [catalog.repairCategories]
  );

  const managedBrands = useMemo(
    () => Array.from(
      new Map(managedModels.map((model) => [model.brandSlug, model.brand])).entries()
    )
      .map(([slug, name]) => ({ slug, name }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    [managedModels]
  );

  const priceModels = useMemo(
    () => managedModels
      .filter((model) => model.brandSlug === priceBrandSlug)
      .sort((left, right) => left.name.localeCompare(right.name)),
    [managedModels, priceBrandSlug]
  );

  function saveCatalog(next: CustomRepairCatalog) {
    setCatalog(next);
    writeCustomRepairCatalog(next);
  }

  async function updateModelImage(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setModelForm((current) => ({ ...current, image }));
  }

  async function updateRepairImage(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setRepairForm((current) => ({ ...current, image }));
  }

  function saveModel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandName = modelForm.brandName.trim();
    const name = modelForm.name.trim();
    if (!brandName || !name) return;

    const model: CustomRepairModel = {
      id: modelForm.id || uid("model"),
      brandName,
      brandSlug: catalogSlug(brandName),
      deviceType: modelForm.deviceType,
      seriesName: modelForm.seriesName.trim() || `${brandName} ${modelForm.deviceType} Series`,
      name,
      slug: catalogSlug(name),
      image: modelForm.image || blankImage
    };

    saveCatalog({
      ...catalog,
      models: modelForm.id
        ? catalog.models.map((item) => (item.id === model.id ? model : item))
        : [model, ...catalog.models]
    });
    setModelForm(emptyModelForm);
  }

  function saveRepair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = repairForm.title.trim();
    if (!title) return;

    const repair: CustomRepairCategory = {
      id: repairForm.id || uid("repair"),
      title,
      slug: catalogSlug(title),
      image: repairForm.image || blankImage,
      summary: repairForm.summary.trim() || "Customer-selected repair category.",
      warranty: repairForm.warranty.trim() || "1 year warranty",
      badge: repairForm.badge.trim(),
      basePrice: repairForm.basePrice ? Number(repairForm.basePrice) : null
    };

    saveCatalog({
      ...catalog,
      repairCategories: repairForm.id
        ? catalog.repairCategories.map((item) => (item.id === repair.id ? repair : item))
        : [repair, ...catalog.repairCategories]
    });
    setRepairForm(emptyRepairForm);
  }

  function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!priceForm.modelSlug || !priceForm.repairSlug) return;
    const price = priceForm.price ? Number(priceForm.price) : null;
    const id = `${priceForm.modelSlug}:${priceForm.repairSlug}`;

    saveCatalog({
      ...catalog,
      prices: [
        { id, modelSlug: priceForm.modelSlug, repairSlug: priceForm.repairSlug, price },
        ...catalog.prices.filter((item) => item.id !== id)
      ]
    });
    setPriceForm(emptyPriceForm);
    setPriceBrandSlug("");
  }

  function deleteModel(id: string) {
    saveCatalog({ ...catalog, models: catalog.models.filter((model) => model.id !== id) });
  }

  function deleteRepair(id: string) {
    const repair = catalog.repairCategories.find((item) => item.id === id);
    saveCatalog({
      ...catalog,
      repairCategories: catalog.repairCategories.filter((item) => item.id !== id),
      prices: repair ? catalog.prices.filter((price) => price.repairSlug !== repair.slug) : catalog.prices
    });
  }

  function deletePrice(id: string) {
    saveCatalog({ ...catalog, prices: catalog.prices.filter((price) => price.id !== id) });
  }

  return (
    <div className="admin-catalog-page">
      <section className="admin-catalog-hero">
        <div>
          <p className="eyebrow">Repair booking catalog</p>
          <h2>Manage brands, models, images and repair prices</h2>
          <span>Add a model once, attach repair categories, then set the exact customer price.</span>
        </div>
        <div className="admin-catalog-stats">
          <strong>{catalog.models.length}<span>custom models</span></strong>
          <strong>{catalog.repairCategories.length}<span>repair categories</span></strong>
          <strong>{catalog.prices.length}<span>price overrides</span></strong>
        </div>
      </section>

      <nav className="admin-catalog-tabs" aria-label="Catalog sections">
        <button className={tab === "models" ? "active" : ""} type="button" onClick={() => setTab("models")}>Models</button>
        <button className={tab === "repairs" ? "active" : ""} type="button" onClick={() => setTab("repairs")}>Repair categories</button>
        <button className={tab === "prices" ? "active" : ""} type="button" onClick={() => setTab("prices")}>Model prices</button>
      </nav>

      {tab === "models" && (
        <section className="admin-catalog-grid">
          <form className="admin-catalog-form" onSubmit={saveModel}>
            <div>
              <p className="eyebrow">{modelForm.id ? "Editing model" : "Add model"}</p>
              <h3>Brand, type and picture</h3>
            </div>
            <label>Brand<input list="catalog-brands" value={modelForm.brandName} onChange={(event) => setModelForm({ ...modelForm, brandName: event.target.value })} placeholder="Apple" required /></label>
            <datalist id="catalog-brands">
              {["Apple", "Samsung", "Google", "Oppo", "Microsoft", ...customBrands].map((brand) => <option key={brand} value={brand} />)}
            </datalist>
            <label>Device type<select value={modelForm.deviceType} onChange={(event) => setModelForm({ ...modelForm, deviceType: event.target.value as CustomDeviceType })}>{deviceTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>Series<input value={modelForm.seriesName} onChange={(event) => setModelForm({ ...modelForm, seriesName: event.target.value })} placeholder="iPhone Series" /></label>
            <label>Model name<input value={modelForm.name} onChange={(event) => setModelForm({ ...modelForm, name: event.target.value })} placeholder="Apple iPhone 17 Pro" required /></label>
            <label className="wide">Upload picture<input type="file" accept="image/*" onChange={(event) => updateModelImage(event.target.files)} /></label>
            {modelForm.image && <img className="admin-catalog-preview" src={modelForm.image} alt="" />}
            <div className="admin-pricing-actions">
              <button className="button primary" type="submit">{modelForm.id ? "Update model" : "Add model"}</button>
              {modelForm.id && <button className="button ghost" type="button" onClick={() => setModelForm(emptyModelForm)}>Cancel</button>}
            </div>
          </form>

          <div className="admin-catalog-list">
            {catalog.models.length ? catalog.models.map((model) => (
              <article className="admin-catalog-item" key={model.id}>
                <img src={model.image} alt="" />
                <div>
                  <strong>{model.name}</strong>
                  <span>{model.brandName} / {model.deviceType} / {model.seriesName}</span>
                </div>
                <button className="button ghost" type="button" onClick={() => setModelForm(model)}>Edit</button>
                <button className="button dark" type="button" onClick={() => deleteModel(model.id)}>Delete</button>
              </article>
            )) : <p className="muted">No custom models yet. Add one to show it in Repair Booking.</p>}
          </div>
        </section>
      )}

      {tab === "repairs" && (
        <section className="admin-catalog-grid">
          <form className="admin-catalog-form" onSubmit={saveRepair}>
            <div>
              <p className="eyebrow">{repairForm.id ? "Editing category" : "Add repair category"}</p>
              <h3>Repair name, image and base price</h3>
            </div>
            <label>Repair name<input value={repairForm.title} onChange={(event) => setRepairForm({ ...repairForm, title: event.target.value })} placeholder="Camera Lens Repair" required /></label>
            <label>Base price<input type="number" min="0" value={repairForm.basePrice} onChange={(event) => setRepairForm({ ...repairForm, basePrice: event.target.value })} placeholder="99" /></label>
            <label>Badge<input value={repairForm.badge} onChange={(event) => setRepairForm({ ...repairForm, badge: event.target.value })} placeholder="starting from" /></label>
            <label>Warranty<input value={repairForm.warranty} onChange={(event) => setRepairForm({ ...repairForm, warranty: event.target.value })} /></label>
            <label className="wide">Short customer description<textarea value={repairForm.summary} onChange={(event) => setRepairForm({ ...repairForm, summary: event.target.value })} placeholder="What this repair fixes..." /></label>
            <label className="wide">Upload repair image<input type="file" accept="image/*" onChange={(event) => updateRepairImage(event.target.files)} /></label>
            {repairForm.image && <img className="admin-catalog-preview" src={repairForm.image} alt="" />}
            <div className="admin-pricing-actions">
              <button className="button primary" type="submit">{repairForm.id ? "Update category" : "Add category"}</button>
              {repairForm.id && <button className="button ghost" type="button" onClick={() => setRepairForm(emptyRepairForm)}>Cancel</button>}
            </div>
          </form>

          <div className="admin-catalog-list">
            {catalog.repairCategories.length ? catalog.repairCategories.map((repair) => (
              <article className="admin-catalog-item" key={repair.id}>
                <img src={repair.image} alt="" />
                <div>
                  <strong>{repair.title}</strong>
                  <span>{money(repair.basePrice)} / {repair.warranty}</span>
                </div>
                <button className="button ghost" type="button" onClick={() => setRepairForm({ ...repair, basePrice: repair.basePrice == null ? "" : String(repair.basePrice) })}>Edit</button>
                <button className="button dark" type="button" onClick={() => deleteRepair(repair.id)}>Delete</button>
              </article>
            )) : <p className="muted">Built-in repairs are already available. Add custom repair categories here.</p>}
          </div>
        </section>
      )}

      {tab === "prices" && (
        <section className="admin-catalog-grid">
          <form className="admin-catalog-form" onSubmit={savePrice}>
            <div>
              <p className="eyebrow">Map price</p>
              <h3>Set a repair price for one model</h3>
            </div>
            <label className="wide">Brand<select value={priceBrandSlug} onChange={(event) => {
              setPriceBrandSlug(event.target.value);
              setPriceForm((current) => ({ ...current, modelSlug: "" }));
            }} required>
              <option value="">Choose brand first</option>
              {managedBrands.map((brand) => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}
            </select></label>
            <label className="wide">Model<select value={priceForm.modelSlug} onChange={(event) => setPriceForm({ ...priceForm, modelSlug: event.target.value })} disabled={!priceBrandSlug} required>
              <option value="">{priceBrandSlug ? "Choose model" : "Select a brand to see its models"}</option>
              {priceModels.map((model) => <option key={`${model.brandSlug}-${model.slug}`} value={model.slug}>{model.name} ({model.type})</option>)}
            </select></label>
            <label>Repair<select value={priceForm.repairSlug} onChange={(event) => setPriceForm({ ...priceForm, repairSlug: event.target.value })} required>
              <option value="">Choose repair</option>
              {managedRepairs.map((repair) => <option key={repair.slug} value={repair.slug}>{repair.title}</option>)}
            </select></label>
            <label>Customer price<input type="number" min="0" value={priceForm.price} onChange={(event) => setPriceForm({ ...priceForm, price: event.target.value })} placeholder="Leave blank for quote" /></label>
            <button className="button primary" type="submit">Save price</button>
          </form>

          <div className="admin-catalog-list">
            {catalog.prices.length ? catalog.prices.map((price) => {
              const model = managedModels.find((item) => item.slug === price.modelSlug);
              const repair = managedRepairs.find((item) => item.slug === price.repairSlug);
              return (
                <article className="admin-catalog-item" key={price.id}>
                  <img src={model?.image || blankImage} alt="" />
                  <div>
                    <strong>{model?.name || price.modelSlug}</strong>
                    <span>{repair?.title || price.repairSlug} / {money(price.price)}</span>
                  </div>
                  <button className="button dark" type="button" onClick={() => deletePrice(price.id)}>Delete</button>
                </article>
              );
            }) : <p className="muted">No model-specific prices yet. Base repair prices are used until you add overrides.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
