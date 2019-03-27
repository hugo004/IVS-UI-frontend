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
                    <ivs-date-range
                        labelStartDate="From" 
                        labelEndDate="To"
                        :startDate.sync="start_date"
                        :endDate.sync="end_date"
                    ></ivs-date-range>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Job title"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea label="Job Duty"></v-textarea>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props:
    {
        startDate: String,
        endDate: String
    },

    data()
    {
        return {
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
};
</script>

<style>
</style>
