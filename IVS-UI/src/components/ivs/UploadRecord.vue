<template>
<v-stepper 
    v-model="currStep" 
    vertical 
    class="elevation-0"
>
    <v-stepper-step :complete="currStep > 1" step="1" editable>
        Basic Info
    </v-stepper-step>

    <v-stepper-content step="1">
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field 
                    label="Name" 
                    v-model="record.name"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field 
                    label="Phone"
                    v-model="record.phone"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field 
                    label="Email"
                    v-model="record.email"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field 
                    label="Location"
                    v-model="record.location"
                ></v-text-field>
            </v-flex>
        </v-layout>

        <v-btn color="green" dark @click="currStep = 2">
            Next
        </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 2" step="2" editable>
        Education
    </v-stepper-step>

    <v-stepper-content step="2">
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
        <v-btn color="secondary" @click="currStep = 1">Previous</v-btn>
        <v-btn color="primary" @click="currStep = 3">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 3" step="3" editable>
        Work Experience
    </v-stepper-step>

    <v-stepper-content step="3">
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
        <v-btn color="primary" @click="currStep = 4">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4" editable>
        Work Skills
    </v-stepper-step>
    <v-stepper-content step="4">
        <v-textarea label="Skills" placeholder="e.g. computer skill, programming skill"></v-textarea>
        <v-btn color="secondary" @click="currStep = 3">Previous</v-btn>
        <v-btn color="primary" @click="saveRecord()">Create</v-btn>
    </v-stepper-content>
</v-stepper>
</template>

<script>

import { CreateRecord } from '@/api/record.js';

export default {
    name: "UploadRecord",
    data() {
        return {
            currStep: 1,
            record: {
                name: "",
                phone: "",
                email: "",
                location: "",
                educations: [],
                workExps: [],
                workSkills: "" 
            },

            workExperience: {
                from: "",
                to: "",
                title: "",
                duty: ""
            },

        }
    },

    methods:
    {
        async saveRecord()
        {
            if (this.currStep >= 4)
            {
                let obj = {};
                this.$emit("saveRecord", obj);
                console.log(this.record);

                let user = {
                    "firstName": this.record.name,
                    "lastName": this.record.name,
                    "email": this.record.email,
                    "phone": this.record.phone,
                    "location": this.record.location,
                    "uid": this.UIDGenerator('u')
                };

                await CreateRecord({
                    "user": user,
                    "recordId": this.UIDGenerator('p'),
                    "createTime": new Date().toISOString(),
                    "educations": this.record.educations,
                    "workExps": this.record.workExps,
                    "workSkills": this.record.workSkills
                });

            }

        },

        UIDGenerator(prefix, length=10)
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return `${prefix}-${text}`;
        },

        addEducations()
        {
            let obj = {
                institution: "",
                qualify: "",
                from: "",
                to: ""
            };
            this.record.educations.push(obj);
        },

        addWorkExps()
        {
            let obj = {
                title: "",
                company: "",
                duty: "",
                from: "",
                to: ""
            };
            this.record.workExps.push(obj);
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
