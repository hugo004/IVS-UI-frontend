<template>
  <material-card
      color="green"
      :title="channel.name"
      :text="`Owner: ${channel.owner}`"
      class="text-capitalize"
    >
      <h3 class="title font-weight-light">Members:</h3>
      <p class="category d-inline-flex font-weight-light">
        <span
          v-for="(name,index) in channelMembers"
          :key="index"
          class="mr-2"
        >
          {{ name }}
        </span> 
      </p>

      <template slot="actions">
        <v-icon
          class="mr-2"
          small
        >
          mdi-clock-outline
        </v-icon>
        <span class="caption grey--text font-weight-light">Channel create time: {{ new Date(channel.createTime).toLocaleDateString() }}</span>
      </template>
      
    <!-- pass all slot -->
      <slot 
        v-for="slot in Object.keys($slots)"
        :name="slot"
        :slot="slot"
      ></slot>
    </material-card>
</template>

<script>
export default {
  props:
  {
    channel:
    {
      type: Object,
      default: {
        name: "",
        members: [],
        creatDate: "",
        joinDate: "",
        owner: ""
      }
    }
  },

  computed: {
    channelMembers() {
      let members = this.channel.members || [];
      let names = [];
      members.forEach(e => {
        let {userName} = e.baseInfo;
        names.push(userName);
      });

      // return names.toString();
      return names;
    }
  }
}
</script>

<style>

</style>
