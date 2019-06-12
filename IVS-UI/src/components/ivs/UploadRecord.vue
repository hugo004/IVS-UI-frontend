<template>
<v-stepper 
    v-model="currStep" 
    vertical 
    class="elevation-0"
>

    <v-stepper-step :complete="currStep > 1" :step="1" editable>
        Education
    </v-stepper-step>

    <v-stepper-content :step="1">
        <v-btn @click="addEducations()" flat>
            <v-icon class="pr-2">fa fa-plus</v-icon>
            New Field
        </v-btn>
        <div>
            <ivs-education 
                class="grey lighten-5 my-4 pa-2"
                v-for="(field,index) in record.educations"
                :key="index"
                :field.sync="field"
                @delete="removeField(field, record.educations)"
            ></ivs-education>
        </div>
        <!-- <v-btn color="secondary" @click="currStep = 1">Previous</v-btn> -->
        <v-btn color="primary" @click="currStep = 2">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 2" :step="2" editable>
        Volunteer Record
    </v-stepper-step>
    <v-stepper-content :step="2">
        <v-btn @click="addVolunteerRecord()" flat>
            <v-icon class="pr-2">fa fa-plus</v-icon>
            New Field
        </v-btn>
        <div>
            <ivs-volunteer-record 
                class="grey lighten-5 my-4 pa-2"
                v-for="(field,index) in record.volunteer"
                :key="index"
                :field.sync="field"
                @delete="removeField(field, record.volunteer)"
            ></ivs-volunteer-record >
        </div>
        <v-btn color="secondary" @click="currStep = 1">Previous</v-btn>
        <v-btn color="primary" @click="currStep = 3">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 3" :step="3" editable>
        Work Experience
    </v-stepper-step>

    <v-stepper-content :step="3">
        <v-btn @click="addWorkExps()" flat>
            <v-icon class="pr-2">fa4 fa-plus</v-icon>
            New Field
        </v-btn>
        <div>
            <ivs-work-experience
                class="grey lighten-5 my-4 pa-2"
                v-for="(field,index) in record.workExps"
                :key="index"
                :field.sync="field"
                @delete="removeField(field, record.workExps)"
            ></ivs-work-experience>
        </div>
        <v-btn color="secondary" @click="currStep = 2">Previous</v-btn>
    </v-stepper-content>

</v-stepper>
</template>

<script>

import { CreateRecord } from '@/api/record.js';

export default {
    name: "UploadRecord",
    
    props: {
        myRecord: Object
    },

    model: {
        prop: 'myRecord',
        event: 'update'
    },

    created() {

    },

    data() {
        return {
            currStep: 1,
            record: {
                educations: [],
                volunteer: [],
                workExps: [],
                workSkills: "",
            }

        }
    },

    watch: {
        record: {
            deep: true,
            handler(val) {
                this.$emit('update:myRecord', val);
            }
        }

    },

    methods:
    {
        async saveRecord()
        {
            if (this.currStep >= 3)
            {
                let obj = {};
                this.$emit("save", this.record);

            }

        },

        addEducations()
        {
            let obj = {
                school: "",
                major: "",
                from: "",
                to: "",
                gpa: 0.0
            };
            this.record.educations.push(obj);
        },

        addWorkExps()
        {
            let obj = {
                jobTitle: "",
                company: "",
                jobDuty: "",
                from: "",
                to: ""
            };
            this.record.workExps.push(obj);
        },

        addVolunteerRecord() {
            let obj = {
                'taskDescription': '',
                'organization': '',
                'hoursWorked': 0,
                'date': '',
                'name': ''
            };

            this.record.volunteer.push(obj);
        },

        removeField(field, from = [])
        {
            let index = from.indexOf(field);
            from.splice(index, 1);
        }
    }
}
</script>

<style>

</style>
