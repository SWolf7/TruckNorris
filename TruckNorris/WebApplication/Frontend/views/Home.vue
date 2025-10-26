<template>
    <div id="app" class="is-preload landing">
        <div id="page-wrapper">

            <!-- Header -->
            <header id="header" style="position: fixed !important; background-color: #272833 !important;">

                <nav id="nav">

                    <ul>
                        <router-link to="/about" style="border-bottom: none !important">
                            <li>About Us</li>
                        </router-link>
                        <router-link to="/login_page" style="border-bottom: none !important">
                            <li class="button primary" style="border-bottom: none !important">Log In</li>
                        </router-link>
                        <router-link to="/login_create" style="border-bottom: none !important">
                            <li class="button primary" style="border-bottom: none !important">Sign-Up</li>
                        </router-link>
                    </ul>
                </nav>
            </header>

            <!-- Banner -->
            <section id="banner">
                <div class="content">
                    <header>
                        <h2>The future of truck driver benefits!</h2>
                        <p>Manage your drivers in an easy and intuitive way!</p>
                    </header>
                    <span class="image"><img src="../public/images/smallTDpic2.jpg" alt="" /></span>
                </div>
                <a href="#one" class="goto-next scrolly">Next</a>
            </section>

            <!-- One -->
            <section id="one" class="spotlight style1 bottom">
                <span class="image fit main"><img src="../public/images/largeTDpic2.png" alt="" /></span>
                <div class="content">
                    <div class="container">
                        <div class="row">
                            <div class="col-4 col-12-medium">
                                <header>
                                    <h2>Help encourage your drivers to keep everyone's roads safe!</h2>
                                    <p>As a sponsor using our program, you can create guidelines that help guide your drivers to stay safe while driving.</p>
                                </header>
                            </div>
                            <div class="col-4 col-12-medium">
                                <p>
                                    As a sponsor, you will be able to accept drivers into your sponsorship program, allowing you to reward
                                    good behavior with your drivers. As a sponsor, you will be able to decide what drivers are accepted
                                    and be able to view their profiles. You will also be able to view all of your drivers that have been accepted by
                                    you as the sponsor.
                                </p>
                            </div>
                            <div class="col-4 col-12-medium">
                                <p>
                                    As a sponsor, you will also be able to determine how your drivers are rewarded and what good behavior is rewarded.
                                    You will be able to choose from a variety of products and then present them to your drivers to purchase with reward
                                    points. These points will be given by you, the sponsor, for good behavior, which you define, to your drivers, and can
                                    be taken away by you, the sponsor, for bad driving behavior.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#two" class="goto-next scrolly">Next</a>
            </section>

            <!-- Two -->
            <section id="two" class="spotlight style2 right">
                <span class="image fit main"><img src="../public/images/largeTDpic3.jpg" alt="" /></span>
                <div class="content">
                    <header>
                        <h2>As a driver, your sponsor will reward you for going the extra mile!</h2>
                        <p>By using good driving practices, you will be able to earn rewards with your sponsor.</p>
                    </header>
                    <p>
                        As a driver, you can apply to a sponsor so you can begin to get rewarded for the things you already do! By driving safely, you will gain points which you can use to purchase
                        items from a pre-approved list selected by your sponsor. This way, you can get items for just driving safely!
                    </p>
                </div>
                <a href="#four" class="goto-next scrolly">Next</a>
            </section>

            <!-- Four -->
            <section id="four" class="wrapper style1 special fade-up">
                <div class="container">
                    <header class="major">
                        <h2>Look at the benefits!</h2>
                    </header>
                    <div class="box alt">
                        <div class="row gtr-uniform">
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-chart-area"></span>
                                <h3>See your drivers' driving behavior over time.</h3>
                                <p>With our reporting system, you will be able to see how drivers gain or lose points over time!</p>
                            </section>
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-comment"></span>
                                <h3>Message your drivers and receive reports.</h3>
                                <p>A built-in message system will allow you to interact with drivers or sponsors.</p>
                            </section>
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-flask"></span>
                                <h3>Encourage your drivers' good driving behavior!</h3>
                                <p>Use the point system to reward good driving within your drivers!</p>
                            </section>
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-paper-plane"></span>
                                <h3>Customize your points store for drivers!</h3>
                                <p>As a sponsor, you determine what drivers can spend their points on and how much points are worth!</p>
                            </section>
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-file"></span>
                                <h3>A dedicated team of support for any help you need!</h3>
                                <p>A dedicated team of admins is on standby for any technical problems you run into!</p>
                            </section>
                            <section class="col-4 col-6-medium col-12-xsmall">
                                <span class="icon solid alt major fa-lock"></span>
                                <h3>A secure database to keep user information safe!</h3>
                                <p>We guarantee to keep your information safe, driver and sponsor alike!</p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Five -->
            <section id="five" class="wrapper style2 special fade">
                <div class="container">
                    <header>
                        <h2>Our Team!</h2>
                        <p>
                            This web app was made by the dedicated Team 18, aka Truck Norris from CPSC 4910. <br>
                            Our team is made up of Sam, Morgan, Zach, Skyler, and Kennan.
                        </p>
                    </header>
                </div>
            </section>

            <!-- Footer -->
            <footer id="footer">
                <ul class="icons">
                    <li><a href="#" class="icon brands alt fa-twitter"><span class="label">Twitter</span></a></li>
                    <li><a href="#" class="icon brands alt fa-facebook-f"><span class="label">Facebook</span></a></li>
                    <li><a href="#" class="icon brands alt fa-linkedin-in"><span class="label">LinkedIn</span></a></li>
                    <li><a href="#" class="icon brands alt fa-instagram"><span class="label">Instagram</span></a></li>
                    <li><a href="#" class="icon brands alt fa-github"><span class="label">GitHub</span></a></li>
                    <li><a href="#" class="icon solid alt fa-envelope"><span class="label">Email</span></a></li>
                </ul>
                <ul class="copyright">
                    <li>&copy; Untitled. All rights reserved.</li>
                    <li>Design: Based on <a href="http://html5up.net">HTML5 UP Modified by Morgan McClure</a></li>
                </ul>
            </footer>

        </div>
    </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      loginBaseUrl: "https://us-east-1mgsxupppv.auth.us-east-1.amazoncognito.com/login",
      clientId: "5nmmpkhvfml67u2vd0d79689o1",
      redirectBaseUrl: "https://2.d19dxmzb7jtiyo.amplifyapp.com/auth-callback",
    };
  },
  computed: {
    loginUrl() {
      return `${this.loginBaseUrl}?client_id=${this.clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(this.redirectBaseUrl)}`;
    },
  },
};
</script>

<style scoped>
    /* Add your scoped styles here */
    /* Example: */
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;*/
    }
</style>
