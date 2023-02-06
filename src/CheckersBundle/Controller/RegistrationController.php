<?php
// src/AppBundle/Controller/RegistrationController.php
namespace CheckersBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use CheckersBundle\Form\UserType;
use CheckersBundle\Entity\Users;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class RegistrationController extends Controller
{
	/**
	 * @Template("CheckersBundle:registration/register.html.twig")
	 */
	public function registerAction(Request $request)
	{
		// 1) build the form
		$user = new Users();
		$form = $this->createForm(UserType::class, $user);

		// 2) handle the submit (will only happen on POST)
		$form->handleRequest($request);
		if ($form->isSubmitted() && $form->isValid()) {

			// 3) Encode the password (you could also do this via Doctrine listener)
			$password = $this->get('security.password_encoder')
				->encodePassword($user, $user->getPlainPassword());
			$user->setPassword($password);

			// 4) save the User!
			$em = $this->getDoctrine()->getManager();
			$em->persist($user);
			$em->flush();

			// ... do any other work - like send them an email, etc
			// maybe set a "flash" success message for the user

			return $this->redirectToRoute('login');
		}

		return array(
			'form' => $form->createView()
		);
	}
}