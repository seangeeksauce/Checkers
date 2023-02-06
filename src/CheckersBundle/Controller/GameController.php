<?php
namespace CheckersBundle\Controller;

use CheckersBundle\Entity\Friends;
use CheckersBundle\Entity\PendingInvites;
use \DateTime;
use CheckersBundle\Entity\Game;
use CheckersBundle\Entity\Users;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class GameController extends Controller {
	/**
	 * @Template("CheckersBundle:game:game.html.twig")
	 */
	public function activeAction(Request $request, $id) {

		return [];
	}
}