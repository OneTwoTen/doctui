import{p as k,U as p}from"./chunks/theme.C_bC_cKN.js";import{d as o,j as d,e as r,a6 as e,B as a,O as t,q as E,C as l,t as c,r as g}from"./chunks/framework.--mPpMZp.js";const F={class:"docs-preview docs-preview--narrow"},v=JSON.parse('{"title":"Selection controls","description":"","frontmatter":{},"headers":[],"relativePath":"guide/selection-controls.md","filePath":"guide/selection-controls.md"}'),u={name:"guide/selection-controls.md"},B=o({...u,setup(y){const i=g("vue"),n=[{value:"vue",label:"Vue"},{value:"react",label:"React",disabled:!0},{value:"svelte",label:"Svelte"},{value:"solid",label:"Solid"}];return(m,s)=>(d(),r("div",null,[s[1]||(s[1]=e("",3)),a("div",F,[t(l(p),{gap:"md"},{default:E(()=>[t(l(k),{id:"docs-raw-framework",modelValue:i.value,"onUpdate:modelValue":s[0]||(s[0]=h=>i.value=h),label:"Combobox engine",description:"Searchable public Combobox; React is disabled.",data:n,searchable:"",clearable:""},null,8,["modelValue"]),a("pre",null,[a("code",null,`<Select
  id="docs-framework"
  v-model="framework"
  label="Framework"
  description="React is disabled in this example."
  :data="frameworks"
  clearable
/>

<Autocomplete
  id="docs-framework-search"
  v-model="search"
  label="Search framework"
  :data="frameworks"
  nothing-found="No matching framework"
/>

<MultiSelect
  id="docs-framework-compare"
  v-model="compare"
  label="Compare with"
  :data="frameworks"
  clearable
/>

<Text size="sm" muted>Combobox value: `+c(i.value??"none")+`</Text>
`,1)])]),_:1})]),s[2]||(s[2]=e("",14))]))}});export{v as __pageData,B as default};
