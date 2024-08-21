import axios from 'axios'
import { slice } from 'lodash'
import { Service } from 'typedi'
import { SECOND_SECRET_TOKEN, SECRET_TOKEN } from '@/config'
import { EternalItems } from '@/constants/eternal-item.constants'

const harvest_ACTION = 114
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

  async harvestResouce(item: string, quantity = 1) {
    console.log('🚀 ~ EternalService ~ harvestResouce ~ quantity:', quantity)
    try {
      const { data } = await axios.get(`${DOMAIN}/user-maps/game/eternal?time=${Math.floor(Date.now() / 1000)}`, {
        headers: {
          Authorization: SECRET_TOKEN
        }
      })
      const energy = await this.getEnergy()
      const energyPerItem = this.getEnergyPerItem(item)
      console.log('🚀 ~ EternalService ~ harvestResouce ~ energy:', energy)
      const { object }: { object: { birth: number; code: string; id: number }[] } = data.data
      const obj = object.filter(it => it.code === item)
      if (!obj.length) {
        console.log(`Object not found`)
        return
      }
      const range = Math.min(Number(quantity), Math.trunc(energy / energyPerItem))
      for (let i = 0; i < range; i++) {
        console.log(`${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${harvest_ACTION}`)
        setTimeout(async () => {
          try {
            await axios({
              method: 'POST',
              headers: {
                Authorization: SECRET_TOKEN,
                'content-type': 'application/json',
                origin: 'https://eternals-webgl.static.cyborg.game'
              },
              url: `${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${harvest_ACTION}`
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

  async getEnergy() {
    const { data } = await axios({
      method: 'GET',
      headers: {
        Authorization: SECRET_TOKEN
      },
      url: `${DOMAIN}/game-profiles?gameKey=eternal`
    })
    return data?.data?.stats?.energy || 0
  }

  private getJumpingGameConfig(level: number) {
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
  }

  async jumpingRope(petId = 4181, level = 1) {
    // init request:
    const authorizationToken = this.getPetToken(petId)
    const { name, result } = this.getJumpingGameConfig(level)
    // const level = `training_001` // level 1
    // const levelPoint = 10
    // const level = `training_002` // level 2
    // const levelPoint = 15
    const { data } = await axios({
      method: 'PUT',
      headers: {
        Authorization: authorizationToken
      },
      data: {
        target: 'USER_ASSET',
        value: 2437, // item id
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
  }

  private getPetToken(petId: number) {
    if (petId === 4181) {
      // holy cat mythic
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
          Authorization: SECRET_TOKEN
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
        url: `${DOMAIN}/user-map-objects/${miningId}/end-mining/end_mining_tower_lvl_2`
      })
      if (data?.data) {
        return data.data
      }
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}
