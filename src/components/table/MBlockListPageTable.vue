<template>
  <div>
    <m-table  :columns="columns"
             :data="items">
      <template slot='height' slot-scope='{ row }'>
        <span class="skip_route">
          <router-link :to="`/block/${row.height}`">{{row.height}}</router-link>
        </span>
      </template>
      <template slot='proposer' slot-scope='{ row }'>
        <span class="skip_route">
          <router-link v-if="row.proposer" :to="`/validators/${row.address}`">{{row.proposer.length>20?row.proposer.slice(0,20) + '...':row.proposer}}</router-link>
          <span v-if="!row.proposer">--</span>
        </span>
      </template>
      <template slot='Age' slot-scope='{ row }'>
        <span v-show="row.Age">{{row.Age}}</span>
      </template>
      <template slot='blockHash' slot-scope='{ row }'>
        <span class="skip_route">
          <router-link :to="`/block/${row.height}`">{{formatHash(row.blockHash)}}</router-link>
        </span>
      </template>
    </m-table>
  </div>
</template>

<script>
export default {
  name: 'MBlockListPageTable',
  props: {
    items: {
      type: Array,
      default: function() {return[]}
    }
  },
  data() {
    return {
      columns: [
        {
          title: 'Height',
          slot: 'height',
          width: 220,
          className: 'text_left'
        },
        {
          title: 'Block Hash',
          slot: 'blockHash',
          width: 350,
          tooltip: true,
        },
        {
          title: 'Proposer',
          slot: 'proposer',
          width: 280,
          tooltip: true,
        },
        {
          title: 'Txs',
          key: 'txs' 
        },
        {
          title: 'Time',
          key: 'Age',
          width: 100,
          className: 'text_right'
        }
      ]
    }
  },
  methods: {
    formatHash(hash) {
      return `${hash.substring(0,11)}...${hash.substring(hash.length-7)}`
    }
  }
}
</script>
