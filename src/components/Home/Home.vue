<template>
<v-app light>
    
    <!-- Toolbar -->
    <v-toolbar dark>
        <v-toolbar-side-icon @click.stop="toggleDrawer()"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>search</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>refresh</v-icon>
        </v-btn>
        
        <v-menu bottom left>
            <v-btn slot="activator" icon dark>
                <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile v-for="i in selectItems" :key="i" @click="rigthMenu(i)">
                    <v-list-tile-title v-text="i"></v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
    </v-toolbar>
    <!-- Toolbar -->

    <v-layout wrap style="max-height: 1000px; overflow-y: scroll">
        <v-container>
            <v-layout justify-center>
                <div v-if="transitionComponent === 'Home'">
                    <lista-usuarios />
                </div>
            </v-layout>
        </v-container>
    
    <!-- Drawer -->
    <v-navigation-drawer
        v-model="drawer"
        permanent
        absolute
    >
    <v-list class="pa-1">
        <v-list-tile avatar>
            <v-list-tile-avatar>
                <v-avatar color="teal">
                    <span class="white--text headline">{{firstnameLetter}}</span>
                </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{fullname}}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
     <v-list dense class="pt-0">
      <v-list-tile v-for="item in drawerItems" :key="item.title" @click="drawerMenu(item.title)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    </v-navigation-drawer>
    <!-- Drawer -->

    </v-layout>
</v-app>
</template>

<script>

// Libs
import axios from "axios";

// Components
import Usuarios from "@/components/Usuarios/Usuarios";

// Config
import { 
    CONFIG
} from "../../config/index";

export default {
    components:{
        'lista-usuarios': Usuarios,
    },
    beforeMount() {
        this.title = 'Home';
        let savedSession = (this.$localStorage.get('session') !== undefined) ? JSON.parse(this.$localStorage.get('session')) : '';
        if (savedSession === null) {
            this.$router.push({path: '/'});
        } else {
            this.username = savedSession.user.email;
            this.fullname = savedSession.user.name;
            this.firstnameLetter = savedSession.user.name.charAt(0);
            this.token = savedSession.token;
            this.transitionComponent = (this.$localStorage.get('componentActive') !== undefined) ? this.$localStorage.get('componentActive') : '';
            this.loadModules();
        }
    },
    name: "Home",
    props: {},
    data() {
        return {
            title: '',
            fullname: '',
            firstnameLetter: '',
            username: '',
            token: '',
            selectItems: [
                'Cerrar sesión'
            ],
            drawer: null,
            drawerItems: [],
            message: {
                success: true,
                content: ""
            },
            transitionComponent: ''
        }
    },
    computed: {
        // 
    },
    methods: {
        loadModules() {
            let self = this;
            self.drawerItems.push({ title: 'Home', icon: 'dashboard' }, { title: 'Usuario', icon: 'question_answer' });
            
        },
        toggleDrawer() {
            this.drawer = !this.drawer;
        },
        drawerMenu(option) {
            let self = this;
            if (option === 'Home') {
                if (self.transitionComponent !== 'Home') {
                    self.transitionComponent = 'Home';
                    self.$localStorage.set('componentActive',self.transitionComponent);

                }
                this.toggleDrawer();
            } else if (option === 'Usuario') {
                if (self.transitionComponent !== 'Usuario') {
                    self.transitionComponent = 'Usuario';
                    self.$localStorage.set('componentActive', self.transitionComponent);
                }
                this.toggleDrawer();
            }
        },
        rigthMenu(option) {
            if (option === 'Cerrar sesión') {
                this.logout();
            }
        },
        logout() {
            let self = this;
            
            axios({
                method: "DELETE",
                url: CONFIG.SERVICE_BASE + CONFIG.SERVICE_URL.LOGIN,
                headers: { "Authorization": "Bearer " + self.token },
            })
            .then(success => {
                console.log(success);
                self.$localStorage.remove('session');
                self.$localStorage.remove('componentActive');
                self.$router.push({path: '/'});
            })
            .catch(err => {
                if (err.response.status === 401) {
                    self.$localStorage.remove('session');
                    self.$router.push({path: '/'});
                } else {
                    console.log(err);
                }
            });
        }
    }
}
</script>

<style>

</style>
