import $ from 'jquery'
import { post } from 'axios'
import Notify from 'handy-notification'
import * as follow_action from '../store/actions/follow_a'
import { leftGroup } from '../store/actions/group-a'
import { insta_notify } from './utils'

/**
 * @param {Object} options
 * @param {Number} options.user
 * @param {String} options.username
 * @param {firstname} options.firstname
 * @param {surname} options.surname
 * @param {Boolean} options.update_followers
 * @param {Boolean} options.update_followings
 * @param {Function} options.dispatch
 * @param {Function} options.done
 */
export const follow = async options => {
  let
    defaults = {
      user: null,
      username: null,
      firstname: null,
      surname: null,
      update_followers: false,
      update_followings: false,
      dispatch: () => { return },
      done: () => { return }
    },
    obj = { ...defaults, ...options },
    {
      user,
      username,
      firstname,
      surname,
      dispatch,
      update_followers,
      update_followings,
      done
    } = obj,
    { data: { mssg, success, ff } } = await post('/api/follow', { user, username })

  if (success) {
    let fwing = {
      follow_id: ff.follow_id,
      follow_to: user,
      follow_by: $('.data').data('session'),
      username,
      firstname,
      surname,
      isFollowing: true,
      follow_time: ff.follow_time
    }
    update_followers ? dispatch(follow_action.Follower(ff)) : null
    update_followings ? dispatch(follow_action.Following(fwing)) : null

    insta_notify({
      to: user,
      type: 'follow'
    })

    done()
  }

  Notify({ value: mssg })

}

/**
 * @param {Object} options
 * @param {Number} options.user
 * @param {Boolean} options.update_followers
 * @param {Boolean} options.update_followings
 * @param {Function} options.dispatch
 * @param {Function} options.done
 */
export const unfollow = async options => {
  let
    defaults = {
      user: null,
      update_followers: false,
      update_followings: false,
      dispatch: () => { return },
      done: () => { return }
    },
    obj = { ...defaults, ...options },
    {
      user,
      dispatch,
      update_followers,
      update_followings,
      done
    } = obj,
    session = $('.data').data('session')

  await post('/api/unfollow', { user })

  update_followers ? dispatch(follow_action.Unfollower(session)) : null
  update_followings ? dispatch(follow_action.Unfollowing(user)) : null

  Notify({ value: 'Deixou de seguir' })
  done()

}

/**
 * @param {Number} user
 */
export const addToFavourites = async user => {
  let { data: { mssg } } = await post('/api/add-to-favourites', { user })
  insta_notify({
    to: user,
    type: 'favourites'
  })
  Notify({ value: mssg })
}

/**
 * @param {Number} user
 */
export const block = async user => {
  let { data: { mssg } } = await post('/api/block', { user })
  Notify({ value: mssg })
}

/**
 * @param {Object} options
 * @param {Number} options.user
 * @param {Number} options.added_by
 * @param {Number} options.group
 * @param {String} options.when
 * @param {Function} options.done
 */
export const joinGroup = async options => {
  let
    defaults = {
      user: null,
      added_by: null,
      group: null,
      when: '',
      done: () => { return }
    },
    obj = { ...defaults, ...options },
    { user, added_by, group, when, done } = obj,
    { data: { mssg, success } } = await post('/api/join-group', { user, added_by, group, when })

  if (success) {
    if (when == 'add_grp_member') {
      insta_notify({
        to: user,
        type: 'add_grp_member',
        group_id: group
      })
    }

    done()
  }

  Notify({ value: mssg })
}

/**
 * @param {Object} options
 * @param {Number} options.user
 * @param {Number} options.group
 * @param {Boolean} options.updateGroups
 * @param {Function} options.dispatch
 * @param {Function} options.done
 */
export const leaveGroup = async options => {
  let
    defaults = {
      user: null,
      group: null,
      updateGroups: false,
      dispatch: () => { return },
      done: () => { return }
    },
    obj = { ...defaults, ...options },
    { user, group, updateGroups, dispatch, done } = obj,
    { data: { mssg } } = await post('/api/leave-group', { user, group })

  updateGroups ? dispatch(leftGroup(group)) : null

  done()
  Notify({ value: mssg })

}
