<?php
/**
 * GeneratePress child theme functions and definitions.
 */

// Remove GeneratePress Premium upsell notice in Customizer
add_action( 'customize_register', function ( $wp_customize ) {
    $wp_customize->remove_section( 'generatepress_upsell_section' );
}, 100 );

// Remove GP upsell by filtering the entire metabox output
add_action( 'add_meta_boxes', function () {
    // Define constant to suppress all GP upsell checks
    if (  ! defined( 'GP_PREMIUM_VERSION' ) ) {
        define( 'GP_PREMIUM_VERSION', '1.0.0' );
    }
}, 1 ); // Priority 1 — runs BEFORE GP registers metaboxes


// Register Footer Widgets
add_action( 'widgets_init', 'generate_child_register_footer_widgets' );
function generate_child_register_footer_widgets() {

    // Logo/About Widget Area (Primary)
    register_sidebar( array(
        'name' => __( 'Footer - About', 'generatepress' ),
        'id' => 'primary-footer',
        'description' => __( 'Left footer area - Logo and company info', 'generatepress' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );

    // Product Menu (Secondary)
    register_sidebar( array(
        'name' => __( 'Footer - Product', 'generatepress' ),
        'id' => 'secondary-footer',
        'description' => __( 'Product links column', 'generatepress' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );

    // Company Menu (Tertiary)
    register_sidebar( array(
        'name' => __( 'Footer - Company', 'generatepress' ),
        'id' => 'tertiary-footer',
        'description' => __( 'Company links column', 'generatepress' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );

    // Support Menu (Quaternary)
    register_sidebar( array(
        'name' => __( 'Footer - Support', 'generatepress' ),
        'id' => 'quaternary-footer',
        'description' => __( 'Support links column', 'generatepress' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );
}

// Footer Bottom Content (Copyright & Links)
add_action( 'generate_footer_left', 'generate_child_footer_left' );
function generate_child_footer_left() {
    ?>
    <p class="footer-copyright">
        &copy; <?php echo date('Y'); ?> GoSweetSpot - SweetSpot Group Limited - Australia
    </p>
    <?php
}

add_action( 'generate_footer_right', 'generate_child_footer_right' );
function generate_child_footer_right() {
    ?>
    <div class="footer-links">
        <a href="<?php echo esc_url( home_url( '/privacypolicy' ) ); ?>">Privacy Policy</a>
        <a href="<?php echo esc_url( home_url( '/termsoftrade-australia' ) ); ?>">Terms of Service</a>
    </div>
    <?php
}

/**
 * GeneratePress Child Theme — Enqueue Styles & Scripts
 */

function gp_child_enqueue_compiled_assets() {
    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();

    /*
     * Global CSS
     */
    $global_css_path = $theme_dir . '/dist/css/global.css';

    if ( file_exists( $global_css_path ) ) {
        wp_enqueue_style(
            'gp-child-global',
            $theme_uri . '/dist/css/global.css',
            array( 'generate-style' ),
            filemtime( $global_css_path )
        );
    }

    /*
     * Global JS
     */
    $global_js_path = $theme_dir . '/dist/js/global.js';

    if ( file_exists( $global_js_path ) ) {
        wp_enqueue_script(
            'gp-child-global',
            $theme_uri . '/dist/js/global.js',
            array(),
            filemtime( $global_js_path ),
            true
        );
    }

    /*
     * Detect current page slug.
     */
    $slug = '';

    if ( is_front_page() ) {
        $slug = 'home';
    } elseif ( is_page() ) {
        global $post;

        if ( $post instanceof WP_Post ) {
            $slug = $post->post_name;
        }
    }

    if ( empty( $slug ) ) {
        return;
    }

    /*
     * Page-specific CSS
     * Example: dist/css/contact.css
     */
    $page_css_path = $theme_dir . '/dist/css/' . $slug . '.css';

    if ( file_exists( $page_css_path ) ) {
        wp_enqueue_style(
            'gp-child-' . $slug,
            $theme_uri . '/dist/css/' . $slug . '.css',
            array( 'gp-child-global' ),
            filemtime( $page_css_path )
        );
    }

    /*
     * Page-specific JS
     * Example: dist/js/contact.js
     */
    $page_js_path = $theme_dir . '/dist/js/' . $slug . '.js';

    if ( file_exists( $page_js_path ) ) {
        wp_enqueue_script(
            'gp-child-' . $slug,
            $theme_uri . '/dist/js/' . $slug . '.js',
            array( 'gp-child-global' ),
            filemtime( $page_js_path ),
            true
        );
    }
}

add_action( 'wp_enqueue_scripts', 'gp_child_enqueue_compiled_assets' );

// Custom header elements
add_action( 'generate_inside_header', 'generate_child_header_buttons', 20 );
function generate_child_header_buttons() {
    ?>
    <div class="header-buttons">
        <a href="<?php echo esc_url( wp_login_url() ); ?>" class="header-btn header-login">Login</a>
        <a href="<?php echo esc_url( home_url( '/signup' ) ); ?>" class="header-btn header-cta">Start Free</a>
    </div>
    <?php
}

// Add custom classes to header
add_filter( 'generate_header_classes', 'generate_child_header_classes' );
function generate_child_header_classes( $classes ) {
    $classes .= ' centered-header';
    return $classes;
}

// Customize site title classes
add_filter( 'generate_site_title_classes', 'generate_child_site_title_classes' );
function generate_child_site_title_classes( $classes ) {
    $classes .= ' centered-title';
    return $classes;
}
