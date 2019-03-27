<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-menu
                ref="menuSD"
                v-model="menu1"
                :close-on-content-click="false"
                :return-value.sync="start_date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="start_date"
                    :label="label"
                    append-icon="event"
                    readonly
                    v-on="on"
                    required
                    :rules="[v => !!v || 'required']"
                ></v-text-field>
                </template>
                <v-date-picker v-model="start_date" :min="new Date().toISOString().substr(0, 10)" no-title>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuSD.save(start_date)">OK</v-btn>
                </v-date-picker>
            </v-menu>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props:
    {
        startDate: String,
        endDate: String,
        label: String
    },

    data()
    {
        return {
            menu1: false,
            menu2: false,

            start_date: this.startDate || new Date().toISOString().substr(0,10),
            search: "",
            selected: [
                {name: "+1 Day", value: 1},
                {name: "+2 Day", value: 2},
                {name: "+3 Day", value: 3},
                {name: "+1 Week", value: 7},
                {name: "+2 Week", value: 14},
            ],
            days: [
                {name: "+1 Day", value: 1},
                {name: "+2 Day", value: 2},
                {name: "+3 Day", value: 3},
                {name: "+1 Week", value: 7},
                {name: "+2 Weeks", value: 14},
                {name: "+3 Weeks", value: 21},
                {name: "+1 Month", value: 30},
            ]
        }
    },

    watch:
    {
        start_date(val)
        {
            this.$emit('update:startDate',val);
        },


    },

    methods:
    {
        addDays(source, days)
        {
            let newDate = new Date(source.valueOf());
            newDate.setDate(newDate.getDate() + days);
            return newDate.toISOString().substr(0,10);
        },

        increaseDate(source, days)
        {
            this.start_date = this.addDays(new Date(source),days);
        }
    }

}
</script>

<style>

</style>
