<template>
<v-stepper v-model="currStep" vertical class="">
    <v-stepper-step :complete="currStep > 1" step="1" editable>
        Basic Info
    </v-stepper-step>

    <v-stepper-content step="1">
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field label="Name"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Phone"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Email"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field label="Location"></v-text-field>
            </v-flex>
        </v-layout>

        <v-btn color="green" dark @click="currStep = 2">
            Continue
        </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 2" step="2" editable>
        Education
    </v-stepper-step>

    <v-stepper-content step="2">
        <v-btn flat class="pa-0">
            <v-icon class="pr-2">fa4 fa-plus</v-icon>
            New Field
        </v-btn>
        <ivs-education></ivs-education>
        <v-btn color="primary" @click="currStep = 3">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currStep > 3" step="3" editable>
        Work Experience
    </v-stepper-step>

    <v-stepper-content step="3">
        <ivs-work-experience></ivs-work-experience>
        <v-btn color="primary" @click="currStep = 4">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4" editable>
        Work Skills
    </v-stepper-step>
    <v-stepper-content step="4">
        <v-textarea label="Skills" placeholder="e.g. computer skill, programming skill"></v-textarea>
        <v-btn color="green" dark>
            create
        </v-btn>
    </v-stepper-content>
</v-stepper>
</template>

<script>
export default {
    data() {
        return {
            currStep: 1,
            contacts: [
                "Phone",
                "Email"
            ],
        }
    }
}
</script>

<style>

</style>
