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
                        :single-date='false'
                        labelStartDate="Date" 
                        :startDate.sync="local_field.date"
                    ></ivs-date-range>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        label="Activity name"
                        v-model="local_field.name"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        label="Organization"
                        v-model="local_field.organization"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea
                        label="Task description"
                        v-model="local_field.taskDescription"
                    ></v-textarea>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        type="number"
                        label="Hours Worked"
                        v-model="local_field.hoursWorked"
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props:
    {
        field: {
          type: Object,
          default: () => ({
            'taskDescription': '',
            'organization': '',
            'hoursWorked': 0,
            'date': '',
            'name': ''
          })
        }
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
}
</script>

<style>

</style>
