import axios from 'axios'
import { slice } from 'lodash'
import { Service } from 'typedi'
import { SECOND_SECRET_TOKEN, SECRET_TOKEN } from '@/config'
import { EternalItems } from '@/constants/eternal-item.constants'
import { sleep } from '@/utils/function'

const HARVEST_ACTION = {
  1: 114,
  2: 136
}

const HEALTH_ITEM = {
  vitamin: 2428,
  painkiller: 2429,
  antibiotics: 2427
}

const CLEAN_PET_ITEM = {
  broom: 2431, // FUR, WEB - 2431
  soap: 2430, // DIRT - 2430
  poopShove: 2433, // POOP - 2433
  cleaningSpray: 2432 // VOMIT - 2432
}

enum CLEAN_PET_TYPE {
  FUR = 'FUR',
  WEB = 'WEB',

  DIRT = 'DIRT',

  POOP = 'POOP',

  VOMIT = 'VOMIT'
}

type WasteStats = {
  dirt: number
  fur: number
  poop: number
  vomit: number
}

const DOMAIN = 'https://api-core.eternals.game'

@Service()
export class EternalService {
  async getResource(item: string) {
    const { data } = await axios.get(`${DOMAIN}/user-maps/game/eternal?time=${Math.floor(Date.now() / 1000)}`, {
      headers: {
        Authorization: SECRET_TOKEN
      }
    })
    const { object }: { object: any[] } = data.data
    const result = object.filter(it => it.code === item)
    return result
  }

  async harvestResouce(item: string, quantity = 1, accountNumber = 1) {
    console.log('🚀 ~ EternalService ~ harvestResouce ~ quantity:', quantity)

    const authorizationToken = this.getPetToken(accountNumber)
    try {
      const { data } = await axios.get(`${DOMAIN}/user-maps/game/eternal?time=${Math.floor(Date.now() / 1000)}`, {
        headers: {
          Authorization: authorizationToken
        }
      })
      const energy = await this.getEnergy(accountNumber)
      const energyPerItem = this.getEnergyPerItem(item)
      console.log('🚀 ~ EternalService ~ harvestResouce ~ energy:', energy)
      const { object }: { object: { birth: number; code: string; id: number }[] } = data.data
      const obj = object.filter(it => it.code === item)
      if (!obj.length) {
        console.log(`Object not found`)
        return
      }
      const actionNumber = HARVEST_ACTION[accountNumber]
      const range = Math.min(Number(quantity), Math.trunc(energy / energyPerItem))
      for (let i = 0; i < range; i++) {
        console.log(`${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${actionNumber}`)
        setTimeout(async () => {
          try {
            await axios({
              method: 'POST',
              headers: {
                Authorization: authorizationToken,
                'content-type': 'application/json',
                origin: 'https://eternals-webgl.static.cyborg.game'
              },
              url: `${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${actionNumber}`
            })
          } catch (error) {
            throw new Error(error?.data || error?.message)
          }
        }, (i + 1) * 1000)
      }

      return slice(obj, 0, range)
    } catch (error) {
      throw new Error(error?.data || error?.message)
    }
  }

  getEnergyPerItem(item: string) {
    if (item === EternalItems.meatRabbit) {
      return 10
    }
    // return 3
    return 4
  }

  async getEnergy(accountNumber = 1) {
    const authorizationToken = this.getPetToken(accountNumber)
    const { data } = await axios({
      method: 'GET',
      headers: {
        Authorization: authorizationToken
      },
      url: `${DOMAIN}/game-profiles?gameKey=eternal`
    })
    return data?.data?.stats?.energy || 0
  }

  private getJumpingGameConfig(level: number) {
    // 2437
    if (level === 1) {
      return {
        name: 'training_001',
        result: 10
      }
    }
    if (level === 2) {
      return {
        name: 'training_002',
        result: 15
      }
    }
    if (level === 3) {
      return {
        name: 'training_003',
        result: 20
      }
    }
  }

  private getCalculatorGameConfig(level: number) {
    // 2438
    if (level === 1) {
      return {
        name: 'training_004',
        result: 10
      }
    }
    if (level === 2) {
      return {
        name: 'training_005',
        result: 15
      }
    }
    if (level === 3) {
      return {
        name: 'training_006',
        result: 20
      }
    }
  }

  async jumpingRope(petId = 4181, level = 1, accountNumber = 1) {
    try {
      // init request:
      const authorizationToken = this.getPetToken(accountNumber)
      const { name, result } = this.getJumpingGameConfig(level)
      const { data } = await axios({
        method: 'PUT',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          target: 'USER_ASSET',
          value: 2938, // item id
          targetClean: 'POOP'
        },
        url: `${DOMAIN}/activity/${name}/pet/${petId}`
      })

      console.log('🚀 ~ EternalService ~ jumpingRope ~ data:', data)
      const { idHistory } = data.data

      // claimed
      const claimed = await axios({
        method: 'POST',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          // easy
          result,
          failed: 0
        },
        url: `${DOMAIN}/activity-history/${idHistory}/claimed`
      })

      return claimed?.data
    } catch (error) {
      throw new Error(error?.data || error?.message)
    }
  }

  private getPetToken(accountNumber: number) {
    if (accountNumber === 1) {
      return SECRET_TOKEN
    } else {
      return SECOND_SECRET_TOKEN
    }
  }

  async startMiningTowerLevel2(petIds: number[]) {
    const miningId = 35867
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${DOMAIN}/user-map-objects/${miningId}/start-mining/start_mining_tower_lvl_2`,
        headers: {
          Authorization: SECRET_TOKEN,
          'content-type': 'application/json',
          origin: 'https://eternals-webgl.static.cyborg.game'
        },
        data: {
          listPet: petIds
        }
      })

      if (data?.data) {
        return data.data
      }
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  async endMiningTownerLevel2() {
    const miningId = 35867
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${DOMAIN}/user-map-objects/${miningId}/end-mining/end_mining_tower_lvl_2`,
        headers: {
          'content-type': 'application/json',
          origin: 'https://eternals-webgl.static.cyborg.game',
          Authorization: SECRET_TOKEN
        }
      })
      if (data?.data) {
        return data.data
      }
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  async getTotalMood(accountNumber: number) {
    const authorizationToken = this.getPetToken(accountNumber)
    const { data } = await axios.get(`${DOMAIN}/user-pets?page=1&perpage=10`, {
      headers: {
        Authorization: authorizationToken
      }
    })

    const result = []
    for (const item of data?.data) {
      const { displayName } = item.attribute
      const { total_mood } = item.stats
      const icon = total_mood > 500 ? '🙂' : '😔'
      result.push(`${displayName}'s mood is ${total_mood} ${icon}`)
    }

    return result
  }

  async recoverTotalMood(accountNumber: number) {
    const authorizationToken = this.getPetToken(accountNumber)
    const { data } = await axios.get(`${DOMAIN}/user-pets?page=1&perpage=10`, {
      headers: {
        Authorization: authorizationToken
      }
    })

    for (const item of data?.data) {
      console.log('🚀 ~ EternalService ~ recoverTotalMood ~ item:', item)
      const { id: petId } = item
      const { healthy, mood: hangoutPoint, waste, hunger } = item.stats
      await this.handleCleanHouse(waste, petId, authorizationToken)
      await sleep(900)
      await this.handleHunger(hunger, petId, accountNumber, authorizationToken)
      await sleep(900)
      await this.handleHealthy(healthy, petId, authorizationToken)
      await sleep(900)
      await this.handleHangoutPoint(hangoutPoint, petId, accountNumber, authorizationToken)
      await sleep(900)
    }

    return true
  }

  async handleCleanHouse(waste: WasteStats, petId: number, authorizationToken: string) {
    console.log(`handleCleanHouse waste = ${JSON.stringify(waste, null, 2)}`)
    const { dirt, fur, poop, vomit } = waste

    for (let i = 0; i < dirt; i++) {
      await this.clearPet(authorizationToken, petId, CLEAN_PET_ITEM.soap, CLEAN_PET_TYPE.DIRT)
      await sleep(900)
    }

    for (let i = 0; i < fur; i++) {
      await this.clearPet(authorizationToken, petId, CLEAN_PET_ITEM.broom, CLEAN_PET_TYPE.FUR)
      await sleep(900)
      await this.clearPet(authorizationToken, petId, CLEAN_PET_ITEM.broom, CLEAN_PET_TYPE.WEB)
      await sleep(900)
    }

    for (let i = 0; i < poop; i++) {
      await this.clearPet(authorizationToken, petId, CLEAN_PET_ITEM.poopShove, CLEAN_PET_TYPE.POOP)
      await sleep(900)
    }

    for (let i = 0; i < vomit; i++) {
      await this.clearPet(authorizationToken, petId, CLEAN_PET_ITEM.cleaningSpray, CLEAN_PET_TYPE.VOMIT)
      await sleep(900)
    }
  }

  async handleHunger(hungerPoint: number, petId: number, accountNumber: number, authorizationToken: string) {
    console.log(`handleHunger`)
    for (let i = hungerPoint; i < 450; i += 150) {
      await this.feedPet(petId, accountNumber, authorizationToken)
      await sleep(500)
    }
  }

  async handleHangoutPoint(hangoutPoint: number, petId: number, accountNumber: number, authorizationToken: string) {
    console.log(`handleHangoutPoint`)
    if (hangoutPoint > 150) {
      return
    }

    await this.hangout(petId, accountNumber, authorizationToken)
    return
  }

  async handleHealthy(healthyPoint: number, petId: number, authorizationToken: string) {
    console.log(`handleHealthy healthyPoint: ${healthyPoint}`)
    await this.takeMedicine(authorizationToken, petId, HEALTH_ITEM.antibiotics)
    await sleep(1000)
    await this.takeMedicine(authorizationToken, petId, HEALTH_ITEM.painkiller)
    await sleep(1000)
    await this.takeMedicine(authorizationToken, petId, HEALTH_ITEM.vitamin)
  }

  async takeMedicine(authorizationToken: string, petId: number, itemId: number) {
    try {
      console.log(`takeMedicine: ${itemId}`)
      const { data } = await axios({
        method: 'PUT',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          target: 'USER_ASSET',
          value: itemId, // item id
          targetClean: 'POOP'
        },
        url: `${DOMAIN}/activity/heal_pet/pet/${petId}`
      })
    } catch (error) {
      console.log(error?.message)
    }
  }

  async feedPet(petId: number, accountNumber: number, token = null) {
    try {
      const authorizationToken = token || this.getPetToken(accountNumber)

      const { data } = await axios({
        method: 'PUT',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          target: 'USER_ASSET',
          value: 29758, // becon 🥓
          targetClean: 'POOP'
        },
        url: `${DOMAIN}/activity/feed_pet/pet/${petId}`
      })
      if (data?.data) {
        console.log(`Feed pet done.`)
      }

      return data
    } catch (error) {
      throw new Error(error?.data || error?.message)
    }
  }

  async hangout(petId: number, accountNumber: number, token = null) {
    try {
      const authorizationToken = token || this.getPetToken(accountNumber)

      const { data } = await axios({
        method: 'PUT',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          target: 'USER_ASSET',
          value: 2435, // Frisbee Disc
          // value: 2436, // Collar
          targetClean: 'POOP'
        },
        url: `${DOMAIN}/activity/hangout_001/pet/${petId}`
      })
      if (data?.data) {
        console.log(`Pet ${petId} hangout done.`)
      }

      return data
    } catch (error) {
      throw new Error(error?.data || error?.message)
    }
  }

  private async clearPet(authorizationToken: string, petId: number, itemId: number, type: string) {
    try {
      const { data } = await axios({
        method: 'PUT',
        headers: {
          Authorization: authorizationToken
        },
        data: {
          target: 'USER_ASSET',
          value: itemId, // item id
          targetClean: type
        },
        url: `${DOMAIN}/activity/clean_pet/pet/${petId}`
      })
    } catch (error) {
      console.log(error?.message)
    }
  }

  async convertToC98(accountNumber: number, pack = 1) {
    try {
      const authorizationToken = this.getPetToken(accountNumber)
      const { data } = await axios({
        method: 'POST',
        headers: {
          Authorization: authorizationToken
        },
        url: `${DOMAIN}/conversion/order/eternal/${pack}`
      })

      return data
    } catch (error) {
      console.log(error?.message)
    }
  }
}
