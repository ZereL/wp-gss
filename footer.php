<?php
/**
 * The template for displaying the footer
 *
 * @package GeneratePress Child
 */

if (  ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}
?>

	</div>
</div>

<?php
do_action( 'generate_before_footer' );

if ( is_active_sidebar( 'primary-footer' ) || is_active_sidebar( 'secondary-footer' ) || is_active_sidebar( 'tertiary-footer' ) || is_active_sidebar( 'quaternary-footer' ) ) {
    ?>
    <div class="site-footer-widgets">
        <div class="site-footer-widgets-container">
            <div class="site-footer-widget-area">
                <?php
dynamic_sidebar( 'primary-footer' );
    ?>
            </div>
            <div class="site-footer-widget-area">
                <?php
dynamic_sidebar( 'secondary-footer' );
    ?>
            </div>
            <div class="site-footer-widget-area">
                <?php
dynamic_sidebar( 'tertiary-footer' );
    ?>
            </div>
            <div class="site-footer-widget-area">
                <?php
dynamic_sidebar( 'quaternary-footer' );
    ?>
            </div>
        </div>
    </div>
    <?php
}

do_action( 'generate_before_footer_content' );
?>

<footer class="site-footer" id="colophon">
    <div class="site-footer-content">
        <div class="footer-bottom-content">
            <div class="footer-left">
                <?php do_action( 'generate_footer_left' ); ?>
            </div>
            <div class="footer-right">
                <?php do_action( 'generate_footer_right' ); ?>
            </div>
        </div>
    </div>
</footer>

<?php do_action( 'generate_after_footer_content' ); ?>
<?php do_action( 'generate_after_footer' ); ?>

<?php wp_footer(); ?>
</body>
</html>