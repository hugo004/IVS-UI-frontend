<template>
    <v-card class="elevation-5">
        <v-card-title>
            <v-btn 
                icon 
                small 
                absolute 
                right 
                @click="$emit('delete')"
            >
                <v-icon>fas fa-times</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-text-field 
                        label="Institution"
                        v-model="local_institu"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea 
                        :rows="1" 
                        auto-grow
                        v-model="local_qualify"
                        placeholder="e.g course title "
                    ></v-textarea>
                </v-flex>
            </v-layout>
            <v-flex xs12>
                <v-layout>
                    <ivs-date-range
                        labelStartDate="From" 
                        labelEndDate="To"
                        :startDate.sync="start_date"
                        :endDate.sync="end_date"
                    ></ivs-date-range>
                </v-layout>
            </v-flex>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props:
    {
        institution: String,
        qualify: String,
        startDate: String,
        endDate: String
    },

    data()
    {
        return {
            local_institu: this.institution,
            local_qualify: this.qualify,
            start_date: this.startDate,
            end_date: this.endDate
        }
    },

    watch:
    {
        start_date(val)
        {
            this.$emit('update:startDate',val);
        },

        end_date(val)
        {
            this.$emit('update:endDate',val);
        }
    }
}
</script>

<style>

</style>
