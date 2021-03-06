+++
title = "Performance"
weight = 9
+++

## Iteration

Javelin ECS can currently process ~500k entities per 16ms tick.

An entity's components are partitioned into tables called **archetypes**. An archetype contains the components of entities that share the same composition. This array of archetypes acts as an index that allow us to skip entire swathes of entities that don't match a query's selector. For example, when querying for entities with components `(A, B)`, we can skip iteration of entities within all archetypes that aren't superset of `(A, B)`.

You can see how archtypes and component storage are implemented in [archetype.ts](https://github.com/3mcd/javelin/blob/master/packages/ecs/src/archetype.ts) and [storage.ts](https://github.com/3mcd/javelin/blob/master/packages/ecs/src/storage.ts), respectively.

### Resources

- [Specs and Legion, two very different approaches to ECS ](https://csherratt.github.io/blog/posts/specs-and-legion/) by [Cora Sherratt](https://github.com/csherratt)
- [Building an ECS #2: Archetypes and Vectorization
  ](https://medium.com/@ajmmertens/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9) by [Sander Mertens](https://github.com/SanderMertens)
- [Memory in Javascript— Beyond Leaks](https://medium.com/walkme-engineering/memory-in-javascript-beyond-leaks-8c1d697c655c) by [Yonatan Kra](https://github.com/yonatankra)

## Memory

Javelin ECS uses little memory and thus produces little garbage. Below is a screenshot of an allocation timeline where 10k entities are iterated by 3 systems per tick at 60Hz. The memory growth (0.3mb) is consistent with standard `setInterval` or `requestAnimationFrame` performance and there is no "sawtooth" pattern of frequent, minor GC events.

**Simple `requestAnimationFrame` loop**
![](/perf-raf.png)

**Simple `requestAnimationFrame` loop @ 10k entities/tick**
![](/perf-raf-ecs.png)

A custom iterator is implemented in [query.ts](https://github.com/3mcd/javelin/blob/master/packages/ecs/src/query.ts) which re-uses the same iterable instance for each query execution. Upgrading to a handwritten iterator from generator functions doubled the speed of iteration and eliminated ~5kb/s worth of garbage accumulation.

## Performance Tests

Run the performance tests by cloning the repository and running `yarn perf`:

```bash
git clone https://github.com/3mcd/javelin
cd javelin
yarn && yarn:perf
```

Example `yarn perf` output:

```
========================================
perf_storage_pooled
========================================
create: 171.759ms
run: 15315.012ms
destroy: 42.628ms
entities      | 450000
components    | 4
queries       | 4
ticks         | 1000
iter          | 525525000
iter_tick     | 525525
avg_tick      | 15.862ms
```
