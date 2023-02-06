<?php
    namespace CheckersBundle\Controller;

    use Symfony\Bundle\FrameworkBundle\Controller\Controller;
    use Symfony\Component\HttpFoundation\Request;
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

    class SecurityController extends Controller {
        /**
         * @Template("CheckersBundle:security:login.html.twig")
         */
        public function loginAction(Request $request) {

            $authUtils = $this->get('security.authentication_utils');

            $error = $authUtils->getLastAuthenticationError();
            if ($error)
                $this->get('session')->getFlashBag()->add('notice', $error);

            return
                array(
                    // last username entered by the user
                    'username' => $authUtils->getLastUsername(),
                    'error' => $authUtils->getLastAuthenticationError(),
            );
        }

        public function loginCheckAction() {
        }
    }