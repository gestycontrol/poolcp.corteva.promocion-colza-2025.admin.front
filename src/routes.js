import SectionDetailView from "@/views/SectionDetailView.vue";
import SectionIndexView from "@/views/SectionIndexView.vue";
import IndexView from "@/views/IndexView.vue";
import LoginErrorView from "@/views/LoginErrorView.vue";
import LoginView from "@/views/LoginView.vue";
import LoginWithPasswordView from "@/views/LoginWithPasswordView.vue";
import LogoutView from "@/views/LogoutView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

export default [
    { path: '/login', component: LoginView, name: 'Login', },
    { path: '/login-with-password', component: LoginWithPasswordView, name: 'LoginWithPassword', },
    { path: '/fromlogin', component: LoginView, name: 'FromLogin', },
    { path: "/login-error", component: LoginErrorView, name: 'LoginError', },
    { path: "/logout", component: LogoutView, name: 'Logout', },
    { path: "/:catchAll(.*)", component: NotFoundView, name: 'NotFound', },
    { path: "/", component: IndexView, name: 'Index', },
    //{ path: '/sections', component: SectionIndexView, name: 'SectionIndex', },
    //{ path: '/sections/:id', component: SectionDetailView, name: 'SectionDetail', },
];