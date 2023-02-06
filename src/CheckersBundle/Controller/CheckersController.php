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

class CheckersController extends Controller {
    const PENDING_FRIEND_REQUEST_TYPE = 'FRIEND_REQUEST';
    const PENDING_FRIEND_REQUEST_STATUS = 'PENDING';

    /**
     * @Template("CheckersBundle:checkers:sidebar.html.twig")
     */
    public function sidebarModuleAction(){
        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('u')
            ->from('CheckersBundle:Users', 'u')
            ->where('u.id = 1');

        $user = $qb
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('g')
            ->from('CheckersBundle:Game', 'g')
            ->where('g.publicGame = true')
            ->andWhere('g.status = :status')
            ->andWhere('g.opponent is null');

        $games = $qb
            ->setParameter('status','PENDING')
            ->getQuery()
            ->getResult();

        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('f')
            ->from('CheckersBundle:Friends', 'f')
            ->where('f.users = :user_id')
            ->andWhere('f.deleted = false');

        $friends = $qb
            ->setParameter('user_id',$user)
            ->getQuery()
                ->getResult();

        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('p')
            ->from('CheckersBundle:PendingInvites', 'p')
            ->where('p.targetUser = :user_id')
            ->andWhere('p.status = :status');
//            ->andWhere('p.inviteType = :inviteType');

        $invites = $qb
            ->setParameter('user_id',$user)
            ->setParameter('status','PENDING')
//            ->setParameter('inviteType','GAME_INVITE')
            ->getQuery()
                ->getResult();

        $pendingFriends = [];
        $pendingGames = [];
        foreach ($invites as $invite) {
            if ($invite->getInviteType() === 'GAME_INVITE')
                $pendingGames[] = $invite;
            else if ($invite->getInviteType() === self::PENDING_FRIEND_REQUEST_TYPE)
                $pendingFriends[] = $invite;
        }

        return [
            'games' => $games,
            'friends' => $friends,
            'invites' => $invites,
            'pendingGames' => $pendingGames,
            'pendingFriends' => $pendingFriends,
        ];
    }

    /**
     * @Template("CheckersBundle:checkers:index.html.twig")
     */
    public function checkersIndexAction() {
        return [];
    }

    /**
     * @Template("CheckersBundle:checkers:create.html.twig")
     */
    public function createAction(Request $request) {
        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('u')
            ->from('CheckersBundle:Users', 'u')
            ->where('u.id = 1');

        $user = $qb
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if ($request->get('submit')) {
            $game = new Game();
            $game->setHost($user);
            $game->setCreatedOn(new DateTime());
            $game->setTitle($request->get('title'));

            if ($request->get('open_game'))
                $game->setPublicGame(true);
            else
                $game->setPublicGame(false);

            if (sizeof($request->get('game_password')))
                $game->setPassword($request->get('game_password'));

            $this->getDoctrine()->getManager()->persist($game);
            $this->getDoctrine()->getManager()->flush();

            return $this->redirect($this->generateUrl('game', ['id' => $game->getId()]));
        }

        return [];
    }

    public function addFriendAction(Request $request) {
        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('u')
            ->from('CheckersBundle:Users', 'u')
            ->where('u.id = 1');

        $user = $qb
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        $friend = $request->get('friend');
        $payload = json_decode($request->getContent());
        $response = new JsonResponse();

        if (empty($payload->email && empty($payload->username)))
            return $response->setData(array(
                'success' => false,
                'error' => 'No Fields were populated.',
            ));

        if (!empty($payload->email) && sizeof($payload->email) > 0) {
            $friend = $this->getDoctrine()->getRepository('CheckersBundle:Users')->findOneBy([
                'email' => $payload->email,
                'deleted' => false,
            ]);
        }

        if (empty($friend) && !empty($payload->username) && sizeof($payload->username) > 0) {
            $friend = $this->getDoctrine()->getRepository('CheckersBundle:Users')->findOneBy([
                'username' => $payload->username,
                'deleted' => false,
            ]);
        }

        if (!$friend)
            return $response->setData(array(
                'success' => false,
                'error' => 'User was not found.',
            ));

        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('count(f.id)')
            ->from('CheckersBundle:Friends', 'f')
            ->where('f.deleted = false')
            ->andWhere($qb->expr()->andX(
                'f.users = :user',
                'f.friend = :friend'
            ));

        $existCheck = $qb
            ->setParameter('user', $user)
            ->setParameter('friend', $friend)
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult();

        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('count(p.id)')
            ->from('CheckersBundle:PendingInvites', 'p')
            ->where('p.targetUser = :friend')
            ->andWhere('p.sender = :user');

        $pendingCheck = $qb
            ->setParameter('user', $user)
            ->setParameter('friend', $friend)
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult();

        if ($existCheck + $pendingCheck > 0)
            return $response->setData(array(
                'success' => false,
                'error' => 'This user has a pending invite or is already in your friends list.',
            ));
        else {
//                $addFriend = new Friends();
//
//                $addFriend->setCreatedOn(new \DateTime);
//                $addFriend->setUsers($user);
//                $addFriend->setFriend($friend);

            $pendingInvite = new PendingInvites();
            $pendingInvite->setTargetUser($friend);
            $pendingInvite->setCreatedOn(new \DateTime);
            $pendingInvite->setInviteType(self::PENDING_FRIEND_REQUEST_TYPE);
            $pendingInvite->setStatus(self::PENDING_FRIEND_REQUEST_STATUS);
            $pendingInvite->setSender($user);


//                $this->getDoctrine()->getManager()->persist($addFriend);
            $this->getDoctrine()->getManager()->persist($pendingInvite);
            $this->getDoctrine()->getManager()->flush();
        }
        return $response->setData(array(
            'success' => true
        ));
    }

    public function removeFriendAction(Users $user) {

    }

    public function sendInviteAction() {

    }

    public function viewProfileAction() {

    }

    public function pendingRequestAction(Request $request) {
        $qb = $this->getDoctrine()->getManager()->createQueryBuilder();
        $qb
            ->select('u')
            ->from('CheckersBundle:Users', 'u')
            ->where('u.id = 1');

        $user = $qb
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        $payload = json_decode($request->getContent());
        $response = new JsonResponse();

        if (!$payload->requestType || !$payload->requestChoice) {
            return $response->setData(array(
                'success' => true,
                'error' => 'Missing data'
            ));
        }

        if ($payload->requestType === self::PENDING_FRIEND_REQUEST_TYPE && $payload->requestChoice === 'CONFIRM') {
            $addFriend = new Friends();
            $addFriend->setCreatedOn(new \DateTime);
            $addFriend->setUsers($user);
            $addFriend->setFriend($friend);

            $this->getDoctrine()->getManager()->persist($pendingInvite);
            $this->getDoctrine()->getManager()->flush();
        }

        return $response->setData(array(
            'success' => true,
        ));
    }

}