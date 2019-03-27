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
                v-for="(field,index) in educations"
                :key="index"
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
                v-for="(field,index) in workExps"
                :key="index"
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
                institution: "",
                workExperience: [],
                workSkills: [] 
            },

            workExperience: {
                from: "",
                to: "",
                title: "",
                duty: ""
            },

            educations: [],
            workExps: []

        }
    },

    methods:
    {
        saveRecord()
        {
            let obj = {};
            this.$emit("saveRecord", obj);
        },

        addEducations()
        {
            this.educations.push('');
        },

        addWorkExps()
        {
            this.workExps.push('');
        }
    }
}
</script>

<style>

</style>
