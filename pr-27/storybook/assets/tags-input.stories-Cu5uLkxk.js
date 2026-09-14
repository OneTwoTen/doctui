import{n as e,x as t}from"./iframe-Dh5-TFhc.js";import{M as n,_ as r,c as i,u as a,y as o}from"./dist-B4SUe0kQ.js";import{t as s}from"./rolldown-runtime-Dh6celcD.js";var c,l,u,d,f,p;function m(){return(m=s((()=>{n(),e(),c={title:`Inputs/TagsInput`,component:i,tags:[`autodocs`],args:{id:`topics`,label:`Topics`,placeholder:`Add a topic`,clearable:!0,separator:`,`,maxTags:6},argTypes:{disabled:{control:`boolean`},readonly:{control:`boolean`},clearable:{control:`boolean`},required:{control:`boolean`},separator:{control:`text`},maxTags:{control:`number`},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},radius:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]}}},l={render:e=>({components:{TagsInput:i},setup(){return{args:e,value:t([`Vue`,`Accessibility`])}},template:`<TagsInput v-bind="args" v-model="value" /><p>Selected: {{ value.join(", ") }}</p>`})},u={render:()=>({components:{Stack:o,TagsInput:i,Text:a},setup(){return{normal:t([`Vue`,`TypeScript`]),limited:t([`Vue`,`Rust`])}},template:`
      <Stack gap="md">
        <TagsInput v-model="normal" label="Normal" description="Comma commits a tag" clearable />
        <TagsInput :model-value="['Vue']" label="Read only" readonly clearable />
        <TagsInput :model-value="['Vue']" label="Disabled" disabled clearable />
        <TagsInput v-model="limited" label="Max 2 tags" :max-tags="2" error="Maximum reached" clearable />
        <Text size="sm">Use Backspace in an empty input to remove the last tag.</Text>
      </Stack>
    `})},d={render:()=>({components:{Stack:o,TagsInput:i,Text:a},setup(){return{value:t([`Design`])}},template:`
      <Stack gap="sm">
        <TagsInput
          id="skills-pipe"
          v-model="value"
          label="Skills"
          separator="||"
          placeholder="Type Design || Vue || Rust"
          clearable
        />
        <Text size="sm">Multi-character separators are parsed from typed or pasted input. Enter always commits the current draft.</Text>
      </Stack>
    `})},f={render:()=>({components:{Group:r,Stack:o,TagsInput:i,Text:a},setup(){return{skills:t([`Vue`,`Accessibility`]),interests:t([`Design systems`])}},template:`
      <Stack gap="lg">
        <Text as="strong">Profile taxonomy</Text>
        <Group align="flex-start" gap="lg">
          <TagsInput
            id="profile-skills"
            v-model="skills"
            label="Skills"
            description="Comma-separated, up to five"
            :max-tags="5"
            clearable
          />
          <TagsInput
            id="profile-interests"
            v-model="interests"
            label="Interests"
            separator="||"
            description="Paste multiple values with ||"
            clearable
          />
        </Group>
        <Text size="sm">Skills: {{ skills.join(', ') }} · Interests: {{ interests.join(', ') }}</Text>
      </Stack>
    `})},p=[`Default`,`StateMatrix`,`MultiCharacterSeparator`,`AdvancedComposition`]})))()}m();export{f as AdvancedComposition,l as Default,d as MultiCharacterSeparator,u as StateMatrix,p as __namedExportsOrder,c as default};