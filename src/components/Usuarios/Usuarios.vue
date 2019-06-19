<template>
    <v-app light>
        <v-container fluid style="padding-left: 21%;">
            <v-dialog v-model="dialog" max-width="500px" persistent>
                <v-card>
                    <v-card-title>
                        <v-flex class="text-md-center text-xs-center">
                            <span class="headline">{{title}}</span>
                        </v-flex>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-container fluid class="px-3">
                                <v-layout row wrap>
                                    <v-text-field
                                        label="Nombres"
                                        name="nombres"
                                        v-model="nombres"
                                        :error-messages="nombresErrors"
                                        @input="$v.nombres.$touch()"
                                        @blur="$v.nombres.$touch()"
                                        required
                                        :readonly="read"
                                    ></v-text-field>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-text-field
                                        label="Email"
                                        name="email"
                                        v-model="email"
                                        :error-messages="emailErrors"
                                        @input="$v.email.$touch()"
                                        @blur="$v.email.$touch()"
                                        placeholder="ejemplo@dominio.com"
                                        autocapitalize="off"
                                        required
                                        :disabled="disableEmail"
                                        :readonly="read"
                                    ></v-text-field>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-text-field
                                        label="Phone"
                                        name="Phone"
                                        v-model="phone"
                                        :error-messages="phoneErrors"
                                        @input="$v.phone.$touch()"
                                        @blur="$v.phone.$touch()"
                                        required
                                        :readonly="read"
                                    ></v-text-field>
                                </v-layout>
                                <v-layout row wrap v-if="action == 'add'">
                                    <v-switch
                                      v-model="switch1"
                                      :label="`Estado`"
                                    ></v-switch>
                                </v-layout>
                                <v-layout row wrap v-if="action == 'see' || action == 'edit'">
                                    <v-switch
                                      v-model="switch1"
                                      :label="`Estado`"
                                      :readonly="read"
                                      :disabled="disablePriv"
                                    ></v-switch>
                                </v-layout>
                                <v-layout row wrap v-if="action == 'add' || action == 'edit'">
                                    <v-text-field
                                        label="Contraseña"
                                        name="password"
                                        v-model="password"
                                        :error-messages="passwordErrors"
                                        @input="$v.password.$touch()"
                                        @blur="$v.password.$touch()"
                                        required
                                        type="password"
                                    ></v-text-field>
                                </v-layout>
                                <v-layout row wrap v-if="action == 'add' || action == 'edit'">
                                    <v-text-field
                                        label="Confirmar Contraseña"
                                        name="c_password"
                                        v-model="c_password"
                                        :error-messages="passwordConfirmErrors"
                                        @input="$v.c_password.$touch()"
                                        @blur="$v.c_password.$touch()"
                                        required
                                        type="password"
                                    ></v-text-field>
                                </v-layout>
                            </v-container>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex class="text-md-right text-xs-right">
                            <v-btn color="primary" v-if="action == 'add'" v-on:click="sendForm" >Enviar</v-btn>
                            <v-btn color="yellow" dark v-if="action == 'edit'" v-on:click="updateUser" >Actualizar</v-btn>
                            <v-btn color="error" v-on:click="dialogEvent(false)">Cancelar</v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <template>
                <v-card>
                    <v-card-title>
                        Lista de Usuarios
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                            <v-btn
                                icon class="mx-0"
                                slot="activator"
                                v-on:click="refresh()"
                            >
                                <v-icon color="blue-grey lighten-1">autorenew</v-icon>
                            </v-btn>
				        <span>Actualizar</span>
				        </v-tooltip>
				        <v-spacer></v-spacer>
				        <v-text-field
					        v-model="search"
    					    append-icon="search"
					        label="Search"
					        single-line
					        hide-details
				        ></v-text-field>
				    </v-card-title>
				    <v-data-table
					    :headers="headers"
					    :items="arrItems"
					    :search="search"
				    >
				    <template slot="items" slot-scope="props">
                        <td class="text-xs-center text-md-center">{{ props.item.id }}</td>
					    <td class="text-xs-center text-md-center">{{ props.item.email }}</td>
                        <td class="text-xs-center text-md-center">{{ props.item.name }}</td>
					    <td class="text-xs-center text-md-center">{{ props.item.phone }}</td>
					    <td class="text-xs-center text-md-center">{{ props.item.status }}</td>
					    <td class="text-xs-center text-md-center">{{ props.item.create_date }}</td>
					    <td class="justify-center layout px-0">
					    <v-btn icon class="mx-0" @click="editUser(props.item)">
						    <v-icon color="teal">edit</v-icon>
					    </v-btn>
					    <v-btn icon class="mx-0" @click="deleteUser(props.item)">
    						<v-icon color="pink">delete</v-icon>
					    </v-btn>
					    <v-btn icon class="mx-0" @click="seeUser(props.item)">
						    <v-icon color="blue">account_circle</v-icon>
					    </v-btn>
					    </td>
				    </template>
				    <v-alert slot="no-results" :value="true" color="error" icon="warning">
					    Your search for "{{ search }}" found no results.
				    </v-alert>
				    </v-data-table>
			    </v-card>
			</template>
            <v-btn
                color="pink"
                dark
                fixed
                bottom
                right
                fab
                v-on:click="addUser()"
            >
                <v-icon>add</v-icon>
            </v-btn>
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
                    <v-btn flat color="pink" @click.native="snackbar = false">Cerrar</v-btn>
                </v-snackbar>
        </v-container>
    </v-app>
</template>

<script>

import axios from "axios";
import moment from "moment";
import { validationMixin } from "vuelidate";
import { required, email, sameAs, minLength } from "vuelidate/lib/validators";

import { CONFIG } from "../../config/index";

export default {
    beforeMount() {
        let savedSession = (this.$localStorage.get('session') !== undefined) ? JSON.parse(this.$localStorage.get('session')) : '';
        if (savedSession === null) {
            this.$router.push({path: '/'});
        } else {
            this.token = savedSession.token;
            this.getUsers();
        }
    },
    name: "Usuarios",
    props: {},
    mixins: [validationMixin],
    validations: {
    nombres: {
      required
    },
    phone: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    },
    c_password: {
      sameAsPassword: sameAs("password")
    }
  },
  data() {
    return {
        id: 0,
        token: "",
        search: "",
        action: "",
        title: "",
        phone: "",
        headers: [
            {
                text: "ID",
                value: "id",
                sortable: false
            }, {
                text: "Email",
                value: "email",
                sortable: false
            }, {
                text: "Nombres",
                value: "name",
                sortable: false
            }, {
                text: "Phone",
                value: "phone",
                sortable: false
            },{
                text: "Estado",
                value: "status",
                sortable: false
            }, {
                text: "Fecha de Creación",
                value: "create_date",
                sortable: false
            }, {
                text: "Acciones",
                sortable: false
            }
        ],
        arrItems: [],
        snackbar: false,
        y: "top",
        x: null,
        mode: "",
        timeout: 6000,
        message: {
            success: true,
            content: ""
        },
        switch1: true,
      dialog: false,
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      c_password: "",
      read: false,
      barcode: "",
      disableEmail: false,
      disablePriv: false
    };
  },
  computed: {
    nombresErrors() {
      const errors = [];
      if (!this.$v.nombres.$dirty) return errors;
      !this.$v.nombres.required && errors.push("Nombres requerido.");
      return errors;
    },
    apellidosErrors() {
      const errors = [];
      if (!this.$v.apellidos.$dirty) return errors;
      !this.$v.apellidos.required && errors.push("Apellido requerido.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("Email requerido.");
      !this.$v.email.email && errors.push("Formato de Email invalido.");
      return errors;
    },
    phoneErrors() {
        const errors = [];
        if (!this.$v.phone.$dirty) return errors;
        !this.$v.phone.required && errors.push("Phone un Privilegio.");
        return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password requerida.");
      !this.$v.password.minLength && errors.push("Maximo 8 caracteres.");
      return errors;
    },
    passwordConfirmErrors() {
      const errors = [];
      if (!this.$v.c_password.$dirty) return errors;
      !this.$v.c_password.sameAsPassword &&
        errors.push("Contraseñas no coinciden.");
      return errors;
    }
  },
  methods: {
    sendForm() {
      let self = this;
      self.$v.$touch();

      if (self.$v.$invalid) {
        console.log("ERROR");
      } else {
        axios({
          method: "POST",
          url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.USERS,
          headers: { "Authorization": "Bearer " + self.token },
          data: {
            name: self.nombres,
            phone: self.phone,
            email: self.email,
            status: (self.switch1 == true) ? 1 : 0,
            password: self.password,
            c_password: self.c_password
          }
        })
          .then(success => {
            self.message.success = success.data.success;
            self.message.content = success.data.content;
            
            self.dialogEvent(false);
            self.handleSnackbar(self.message.success, self.message.content);
            
            setTimeout(function() {
                self.cleanForm();
                self.refresh();
            }, 500);
          })
          .catch(err => {
              let validationErr = err.response.error;
              let customErr = err.response.data;
              
              if (err.response.status === 400) {
                if (customErr) {
                    self.message.success = customErr.success;
                    self.message.content = customErr.content;

                }
                if (validationErr) {
                    if (validationErr.nombres) {
                        self.message.success = false,
                        self.message.content = validationErr.nombres[0];
                    }
                    if (validationErr.apellido) {
                        self.message.success = false,
                        self.message.content = validationErr.apellido[0];

                    }
                    if (validationErr.email) {
                        self.message.success = false,
                        self.message.content = validationErr.email[0];

                    }
                    if (validationErr.password) {
                        self.message.success = false,
                        self.message.content = validationErr.password[0];

                    }
                    if (validationErr.c_password) {
                        self.message.success = false,
                        self.message.content = validationErr.c_password[0];
                        
                    }
                }
            } else if (err.response.status === 401) {
              self.$localStorage.remove('session');
              self.$router.push({path: '/'});
            } else {
                console.log(err);
            }
            
            self.handleSnackbar(self.message.success, self.message.content);
          });
      }
    },
    dialogEvent(status) {
        let self = this;
        
        self.dialog = status;
        setTimeout(function() {
            self.title = "Registrar Usuario";
        }, 200);
        self.$v.$reset();
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
    cleanForm() {
        this.nombres = "";
        this.phone = "";
        this.status = true;
        this.email = "";
        this.password = "";
        this.c_password = "";
    },
    getUsers() {
        let self = this;

        axios({
            method: "GET",
            url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.USERS,
            headers: { "Authorization": "Bearer " + self.token }
        })
        .then(success => {
            for (let i = 0; i < success.data.rows.length; i++) {
                if (success.data.rows[i].status == 1) {
                    success.data.rows[i].status = "Activo";
                } else {
                    success.data.rows[i].status = "Inactivo";
                }
                success.data.rows[i].create_date = moment(success.data.rows[i].create_date).format('DD/MM/YYYY');
                self.arrItems.push(success.data.rows[i]);
            }
        })
        .catch(err => {
            if (err.response.status === 401) {
                self.$localStorage.remove('session');
                self.$router.push({path: '/'});
            } else {
                console.log(err);
            }
        });
    },
    seeUser(user) {
        let self = this;

        self.action = "see";
        self.title = "Ver Usuario";
        self.read = true;
        self.nombres = user.name;
        self.email = user.email;
        self.phone =  user.phone
        self.switch1 = (user.status == 'Activo') ? true : false;

        self.dialog = !self.dialog;
    },
    editUser(user) {
        let self = this;

        self.action = "edit";
        self.title = "Actualizar Usuario";
        
        self.id = user.id;
        self.nombres = user.name;
        self.email = user.email;
        self.phone = user.phone;
        self.switch1 = (user.status == 'Activo') ? true : false;

        self.disableEmail = true;

        self.dialog = !self.dialog;
    },
    updateUser(){
        let self = this;
        self.$v.$touch();

        console.log(self.nombres);

      if (self.$v.$invalid) {
        console.log("ERROR");
      } else {
        axios({
          method: "PUT",
          url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.USERS + '/' + self.id,
          headers: { "Authorization": "Bearer " + self.token },
          data: {
            name: self.nombres,
            phone: self.phone,
            email: self.email,
            status: (self.switch1 == true) ? 1 : 0,
            password: self.password,
            c_password: self.c_password
          }
        })
          .then(success => {
            self.message.success = success.data.success;
            self.message.content = success.data.content;
            
            self.dialogEvent(false);
            self.handleSnackbar(self.message.success, self.message.content);
            
            setTimeout(function() {
                self.cleanForm();
                self.refresh();
            }, 500);
          })
          .catch(err => {
              let validationErr = err.response.error;
              let customErr = err.response.data;
              
              if (err.response.status === 400) {
                if (customErr) {
                    self.message.success = customErr.success;
                    self.message.content = customErr.content;

                }
                if (validationErr) {
                    if (validationErr.nombres) {
                        self.message.success = false,
                        self.message.content = validationErr.nombres[0];
                    }
                    if (validationErr.apellido) {
                        self.message.success = false,
                        self.message.content = validationErr.apellido[0];

                    }
                    if (validationErr.email) {
                        self.message.success = false,
                        self.message.content = validationErr.email[0];

                    }
                    if (validationErr.password) {
                        self.message.success = false,
                        self.message.content = validationErr.password[0];

                    }
                    if (validationErr.c_password) {
                        self.message.success = false,
                        self.message.content = validationErr.c_password[0];
                        
                    }
                }
            } else if (err.response.status === 401) {
              self.$localStorage.remove('session');
              self.$router.push({path: '/'});
            } else {
                console.log(err);
            }
            
            self.handleSnackbar(self.message.success, self.message.content);
          });
      }
    },
    addUser() {
        let self= this;

        self.action = "add";
        self.title = "Registrar Usuario";

        self.read = false;
        self.nombres = "";
        self.apellidos = "";
        self.email = "";



        self.dialog = !self.dialog;
    },
    showBarcode() {
        window.open(CONFIG.SERVICE_BASE+CONFIG.SERVICE_URL.GENERATEBARCODE+'/'+this.barcode);
    },
    refresh() {
        let self = this;
        
        self.arrItems = [];
        
        setTimeout(function() {
            self.getUsers();
        }, 200);
    },
    deleteUser(user) {
        let self = this;

        let conf = confirm("Esta seguro de Eliminar este usuario " + user.email);

        if (conf === true) {
            axios({
                method: "DELETE",
                url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.USERS + "/"+user.id,
                headers: { "Authorization": "Bearer " + self.token }
                })
                .then(success => {
                    let response = success.data;
                    
                    self.message.success = response.success;
                    self.message.content = response.content;
                                        
                    self.handleSnackbar(self.message.success, self.message.content);
                    self.refresh();

                })
                .catch(err => {
                    if (err.response.status === 401) {
                        self.$localStorage.remove('session');
                        self.$router.push({path: '/'});
                    } else {
                        console.log(err);
                    }
                });
        } else {
            return false;
        }
    }
  }
};
</script>

<style>
</style>
