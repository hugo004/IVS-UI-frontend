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
                        :startDate.sync="local_field.from"
                        :endDate.sync="local_field.to"
                    ></ivs-date-range>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        label="Company Name"
                        v-model="local_field.company"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        label="Job title"
                        v-model="local_field.title"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea 
                        label="Job Duty"
                        v-model="local_field.duty"
                    ></v-textarea>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props:
    {
        field: Object
    },

    data()
    {
        return {
            local_field: this.field
        }
    },

    watch:
    {

        local_field:
        {
            deep: true,
            handler(val)
            {
                this.$emit('update:field', val);
            }
        }
    }
};
</script>

<style>
</style>
