<template>
  <v-container 
  fluid 
  grid-list-xl 
  fill-height
  >
    <v-layout column>
      <v-flex>
        <span class="heading">My Channels</span>
        <v-btn 
          color="green"
          dark
          right
          absolute
          outline
          @click="dialog=true"
        >
          <v-icon>fas fa-users</v-icon>
          <span class="heading px-2">Create Channel</span>
        </v-btn>
      </v-flex>
      <v-flex>
        <v-layout
          row
          wrap
        >
          <ivs-channel-card
            v-for="(channel,index) in myChannels"
            :key="index"
            :channel="channel"
          ></ivs-channel-card>
        </v-layout>
      </v-flex>
      <v-flex>
        <material-card 
          title="Channel Record"
          text="Channel Name: xx"
        >
          <v-data-table
            :headers="tableHeaders"
            :items="tableItems"
          >
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog">
      <ivs-channel-create-form></ivs-channel-create-form>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  data()
  {
    return {
      dialog: false,
      tableHeaders: [],
      tableItems: [],
      myChannels: [
        {
          name: "Dummy channel",
          members: ["Hugo", "Lock"],
          createDate: "2019-01-01",
          joinDate: "2019-03-03",
          owner: "Hugo"
        }
      ]
    }
  }

}
</script>

<style>

</style>
