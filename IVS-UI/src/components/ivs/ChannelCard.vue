<template>
  <material-card
      color="green"
      :title="channel.name"
      :text="`Owner: ${channel.owner}`"
    >
      <h3 class="title font-weight-light">Members:</h3>
      <p class="category d-inline-flex font-weight-light">{{ channelMembers }}</p>

      <template slot="actions">
        <v-icon
          class="mr-2"
          small
        >
          mdi-clock-outline
        </v-icon>
        <span class="caption grey--text font-weight-light">Channel create time: {{ new Date(channel.createTime).toLocaleDateString() }}</span>
      </template>
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

  computed:
  {
    channelMembers()
    {
      let members = this.channel.members || [];
      let names = [];
      members.forEach(e => {
        let {firstName, lastName} = e.baseInfo;
        names.push(`${lastName} ${firstName}`);
      });

      return names.toString();
    }
  }
}
</script>

<style>

</style>
