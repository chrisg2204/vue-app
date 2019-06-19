<template>
<v-app light>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 md6 offset-md3>
                <v-card flat>
                    <v-toolbar color="indigo" dark>
                        <v-flex justify-center>
                            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
                        </v-flex>
                    </v-toolbar>
                    <v-form>
                        <v-text-field
                            prepend-icon="person"
                            label="Username"
                            name="Username"
                            v-model="email"
                            :error-messages="emailErrors"
                            required
                            @input="$v.email.$touch()"
                            @blur="$v.email.$touch()"
                        >
                        </v-text-field>
                        <v-text-field
                            prepend-icon="lock"
                            label="Password"
                            name="Password"
                            type="password"
                            v-model="password"
                            :error-messages="passwordErrors"
                            required
                            @input="$v.password.$touch()"
                            @blur="$v.password.$touch()"
                        >
                        </v-text-field>
                        <v-card-actions>
                            <v-btn v-on:click="sendFormLogin" primary large block>Login</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
                <v-snackbar
                    :timeout="timeout"
                    :top="y === 'top'"
                    :bottom="y === 'bottom'"
                    :right="x === 'right'"
                    :left="x === 'left'"
                    :multi-line="mode === 'multi-line'"
                    :vertical="mode === 'vertical'"
                    v-model="snackbar"
                >
                    {{ message.content }}
                    <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
                </v-snackbar>
            </v-flex>
        </v-layout>
    </v-container>
</v-app>
</template>

<script>
// Libs
import axios from "axios";
import atob from "atob";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

// Configuración.
import { CONFIG } from "../../config/index";

export default {
    beforeMount() {
        let savedSession = (this.$localStorage.get('session') !== undefined) ? JSON.parse(this.$localStorage.get('session')) : '';
        if (savedSession !== null) {
            this.$router.push({path: '/home'});
        }
    },
    name: "Login",
    props: {},
    mixins: [validationMixin],
    validations: {
        email: {
            required,
            email
        },
        password: {
            required
        }
    },
    data() {
        return {
            snackbar: false,
            y: "bottom",
            x: null,
            mode: "",
            timeout: 3000,
            message: {
                success: true,
                content: ""
            },
            email: "",
            password: ""
        }
    },
    computed: {
        emailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.email && errors.push("Formato de Email invalido.");
            !this.$v.email.required && errors.push("Email requerido.");
            
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.required && errors.push("Contraseña requerida.");
            
            return errors;
        }
    },
    methods: {
        sendFormLogin() {
            let self = this;
            self.$v.$touch();

            if (self.$v.$invalid) {
                console.log("ERROR");
            } else {
                axios({
                    method: "POST",
                    url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.LOGIN,
                    headers: { "Content-Type": "application/json" },
                    data: { email: self.email, password: self.password }
                })
                .then(success => {
                    let response = success.data
                    self.$localStorage.set('session', JSON.stringify(response));
                    self.$localStorage.set('componentActive', 'Home');
                    self.$router.push({path: '/home'});
                })
                .catch(err => {
                    let validationErr = err.response.error;
                    let customErr = err.response.data;

                    if (err.response.status === 400) {
                        if (validationErr) {
                            if (validationErr.email) {
                                self.message.success = false,
                                self.message.content = validationErr.email[0];
                            }
                            if (validationErr.password) {
                                self.message.success = false,
                                self.message.content = validationErr.password[0];
                            }
                        }
                    } else if (err.response.status === 401) {
                        if (customErr) {
                            self.message.success = customErr.success;
                            self.message.content = customErr.content;

                        }
                    } else {
                        console.log(err);
                    }
                    
                    self.handleSnackbar(self.message.success, self.message.content);
                });
            }
        },
        handleSnackbar(success, content) {
            let self = this;
            
            self.message.success = success;
            self.message.content = content;
            self.snackbar = true;
            
            setTimeout(function() {
                self.snackbar = false;
            }, 3000);
        },
    }
}
</script>

<style>

</style>
