<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout class="text-xs-center">
                <ivs-date label="From" class="mr-3"></ivs-date>
                <ivs-date label="To" class="ml-3"></ivs-date>
            </v-layout>
        </v-flex>
        <v-flex xs12>
            <v-text-field label="Job title"></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-textarea label="Job Duty"></v-textarea>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    
};
</script>

<style>
</style>
