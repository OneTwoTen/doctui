import{C as e,G as t,I as n,K as r,N as i,V as a,it as o,l as s}from"./iframe-B-l4A2BW.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";var l,u,d,f,p,m,h,g;function _(){return(_=c((()=>{i(),r(),l={title:`Inputs/TagsInput`,component:e,tags:[`autodocs`],args:{id:`topics`,label:`Topics`,placeholder:`Add a topic`,clearable:!0,separator:`,`,maxTags:6},argTypes:{disabled:{control:`boolean`},readonly:{control:`boolean`},clearable:{control:`boolean`},required:{control:`boolean`},separator:{control:`text`},maxTags:{control:`number`},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},radius:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]}}},u={render:t=>({components:{TagsInput:e},setup(){return{args:t,value:o([`Vue`,`Accessibility`])}},template:`<TagsInput v-bind="args" v-model="value" /><p>Selected: {{ value.join(", ") }}</p>`})},d={render:()=>({components:{Stack:t,TagsInput:e},setup(){return{xs:o([`Vue`,`Rust`]),sm:o([`Vue`,`Rust`]),md:o([`Vue`,`Rust`]),lg:o([`Vue`,`Rust`]),xl:o([`Vue`,`Rust`])}},template:`
      <Stack gap="md">
        <TagsInput v-model="xs" size="xs" label="Extra small" clearable />
        <TagsInput v-model="sm" size="sm" label="Small" clearable />
        <TagsInput v-model="md" size="md" label="Medium" clearable />
        <TagsInput v-model="lg" size="lg" label="Large" clearable />
        <TagsInput v-model="xl" size="xl" label="Extra large" clearable />
      </Stack>
    `})},f={render:()=>({components:{Stack:t,TagsInput:e,Text:s},setup(){return{normal:o([`Vue`,`TypeScript`]),limited:o([`Vue`,`Rust`])}},template:`
      <Stack gap="md">
        <TagsInput v-model="normal" label="Normal" description="Comma commits a tag" clearable />
        <TagsInput :model-value="['Vue']" label="Read only" readonly clearable />
        <TagsInput :model-value="['Vue']" label="Disabled" disabled clearable />
        <TagsInput v-model="limited" label="Max 2 tags" :max-tags="2" error="Maximum reached" clearable />
        <Text size="sm">Use Backspace in an empty input to remove the last tag. Click the control surface to return focus to the editor.</Text>
      </Stack>
    `})},p={render:()=>({components:{Button:n,Stack:t,TagsInput:e,Text:s},setup(){let e=o([`Vue`,`Accessibility`]),t=o([]);return{skills:e,submitted:t,submit:e=>{let n=e.currentTarget;t.value=new FormData(n).getAll(`skills`).map(e=>String(e))}}},template:`
      <form @submit.prevent="submit">
        <Stack gap="md">
          <TagsInput
            id="form-skills"
            v-model="skills"
            name="skills"
            label="Skills"
            description="Only committed tags are submitted"
            placeholder="Type a draft without committing it"
            clearable
          />
          <Group>
            <Button type="submit">Read FormData</Button>
            <Text size="sm">Submitted: {{ submitted.length ? submitted.join(', ') : 'Nothing submitted yet' }}</Text>
          </Group>
        </Stack>
      </form>
    `})},m={render:()=>({components:{Stack:t,TagsInput:e,Text:s},setup(){return{value:o([`Design`])}},template:`
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
    `})},h={render:()=>({components:{Group:a,Stack:t,TagsInput:e,Text:s},setup(){return{skills:o([`Vue`,`Accessibility`]),interests:o([`Design systems`])}},template:`
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
    `})},g=[`Default`,`SizeMatrix`,`StateMatrix`,`NativeFormSubmission`,`MultiCharacterSeparator`,`AdvancedComposition`]})))()}_();export{h as AdvancedComposition,u as Default,m as MultiCharacterSeparator,p as NativeFormSubmission,d as SizeMatrix,f as StateMatrix,g as __namedExportsOrder,l as default};