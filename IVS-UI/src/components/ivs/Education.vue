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
                        label="School"
                        v-model="local_field.school"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea 
                        :rows="1" 
                        auto-grow
                        label="Major"
                        v-model="local_field.major"
                        placeholder="e.g course title "
                    ></v-textarea>
                </v-flex>
            </v-layout>
            <v-flex xs12>
                <v-layout>
                    <ivs-date-range
                        labelStartDate="From" 
                        labelEndDate="To"
                        :startDate.sync="local_field.from"
                        :endDate.sync="local_field.to"
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
        field: Object
    },

    data()
    {
        return {
            local_field: this.field,
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
