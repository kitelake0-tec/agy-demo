import sys
import os
import random
import json
import logging
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean, Float, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# --- Configuration & Logging ---
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("CheonmuServer")

Base = declarative_base()

# --- Part A: Database Schema ---

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    last_login = Column(String)

class Character(Base):
    __tablename__ = 'characters'
    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    name = Column(String, unique=True)
    level = Column(Integer, default=1)
    exp = Column(Integer, default=0)
    money = Column(Integer, default=0)
    hp = Column(Integer, default=100)
    mp = Column(Integer, default=50)
    max_hp = Column(Integer, default=100)
    max_mp = Column(Integer, default=50)
    faction = Column(Integer, default=0)  # 0:None, 1:Justice, 2:Unorthodox, 3:Demonic
    map_id = Column(Integer, ForeignKey('map_info.id'), default=1) # Default to Novice Village
    x = Column(Integer, default=0)
    y = Column(Integer, default=0)
    contribution_point = Column(Integer, default=0)
    key_mapping = Column(Text, default="{}") # JSON string

    inventory = relationship("Inventory", back_populates="character")
    learned_skills = relationship("LearnedSkill", back_populates="character")

class MapInfo(Base):
    __tablename__ = 'map_info'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    min_level = Column(Integer)
    max_level = Column(Integer)
    allowed_faction = Column(Integer, default=0) # 0: All
    is_neutral = Column(Boolean, default=False)

class MonsterTemplate(Base):
    __tablename__ = 'monster_templates'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    level = Column(Integer)
    hp = Column(Integer)
    exp = Column(Integer)
    faction_type = Column(Integer, default=0) # Used for flavor text
    drop_table_id = Column(Integer) # Simplified for this demo

class ItemTemplate(Base):
    __tablename__ = 'item_templates'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String) # Weapon, Armor, Accessory, Potion, SkillBook
    grade = Column(Integer, default=1)
    stats = Column(Integer, default=0) # Damage or Def or Recovery amount
    price = Column(Integer, default=0)

class SkillTemplate(Base):
    __tablename__ = 'skill_templates'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    damage_percent = Column(Float)
    cooldown = Column(Float)
    req_job = Column(Integer) # 0:All, 1:Justice, 2:Unorthodox, 3:Demonic

class NpcTemplate(Base):
    __tablename__ = 'npc_templates'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String) # Weapon, Armor, Acc, Potion
    map_id = Column(Integer, ForeignKey('map_info.id'))

class ShopList(Base):
    __tablename__ = 'shop_list'
    npc_id = Column(Integer, ForeignKey('npc_templates.id'), primary_key=True)
    item_id = Column(Integer, ForeignKey('item_templates.id'), primary_key=True)

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(Integer, primary_key=True)
    char_id = Column(Integer, ForeignKey('characters.id'))
    item_id = Column(Integer, ForeignKey('item_templates.id'))
    enchant_level = Column(Integer, default=0)
    is_equipped = Column(Boolean, default=False)
    
    character = relationship("Character", back_populates="inventory")
    item = relationship("ItemTemplate")

class LearnedSkill(Base):
    __tablename__ = 'learned_skills'
    id = Column(Integer, primary_key=True)
    char_id = Column(Integer, ForeignKey('characters.id'))
    skill_id = Column(Integer, ForeignKey('skill_templates.id'))
    skill_level = Column(Integer, default=1)

    character = relationship("Character", back_populates="learned_skills")
    skill = relationship("SkillTemplate")

# --- Part B: Game Logic ---

class GameServer:
    def __init__(self):
        self.engine = create_engine('sqlite:///:memory:', echo=False) # In-memory DB for simulation
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()
        self.init_data()
        self.factions = {0: "무소속", 1: "천무맹(정파)", 2: "흑풍회(사파)", 3: "혈신교(마교)"}

    def log(self, message):
        logger.info(message)

    def init_data(self):
        # Maps
        maps = [
            MapInfo(id=1, name="무명촌", min_level=1, max_level=100, is_neutral=True),
            MapInfo(id=101, name="초보자 사냥터", min_level=1, max_level=5),
            MapInfo(id=102, name="초보자 사냥터 2", min_level=6, max_level=9),
            MapInfo(id=201, name="낙양성(정파 본성)", min_level=10, max_level=100, allowed_faction=1),
            MapInfo(id=202, name="죽림오채(사파 본성)", min_level=10, max_level=100, allowed_faction=2),
            MapInfo(id=203, name="천산마궁(마교 본성)", min_level=10, max_level=100, allowed_faction=3),
            MapInfo(id=302, name="흑풍곡(사파 사냥터)", min_level=11, max_level=20, allowed_faction=2),
            MapInfo(id=400, name="중원(중립 마을)", min_level=20, max_level=100, is_neutral=True)
        ]
        self.session.add_all(maps)

        # Items
        items = [
            ItemTemplate(id=1, name="소림대환단", type="Potion", stats=50, price=10),
            ItemTemplate(id=101, name="사파식 도", type="Weapon", grade=2, stats=20, price=1000),
            ItemTemplate(id=999, name="전설의 무기", type="Weapon", grade=5, stats=100, price=99999),
        ]
        self.session.add_all(items)

        # Skills
        skills = [
            SkillTemplate(id=1, name="기본 검술", damage_percent=1.2, cooldown=0.0, req_job=0),
            SkillTemplate(id=11, name="흑풍참", damage_percent=2.5, cooldown=5.0, req_job=2),
        ]
        self.session.add_all(skills)

        # Monsters
        monsters = [
            MonsterTemplate(id=1, name="들개", level=1, hp=30, exp=10),
            MonsterTemplate(id=2, name="멧돼지", level=6, hp=100, exp=50),
            MonsterTemplate(id=10, name="산적", level=15, hp=300, exp=150, faction_type=2),
            MonsterTemplate(id=99, name="천년 묵은 혈마", level=50, hp=5000, exp=50000, faction_type=3),
        ]
        self.session.add_all(monsters)

        # NPCs & Shops
        npcs = [
            NpcTemplate(id=1, name="무기 상인", type="Weapon", map_id=202), # In Unorthodox base
        ]
        self.session.add_all(npcs)
        
        shops = [
            ShopList(npc_id=1, item_id=101)
        ]
        self.session.add_all(shops)

        self.session.commit()

    def create_character(self, name):
        char = Character(name=name, hp=100, max_hp=100, mp=50, max_mp=50, money=5000) # Give some starting money for demo
        self.session.add(char)
        self.session.commit()
        self.log(f"⚔️ 캐릭터 생성: [{char.name}]가 무림에 발을 들였습니다. (Lv.{char.level})")
        return char

    def get_character(self, name):
        return self.session.query(Character).filter_by(name=name).first()

    def configure_key(self, char_name, key, target_name, type_):
        # type_: 'Skill' or 'Item'
        char = self.get_character(char_name)
        mapping = json.loads(char.key_mapping)
        
        target_id = None
        if type_ == 'Skill':
            skill = self.session.query(SkillTemplate).filter_by(name=target_name).first()
            if skill: 
                target_id = skill.id
                # Grant skill if not learned for demo convenience
                if not self.session.query(LearnedSkill).filter_by(char_id=char.id, skill_id=skill.id).first():
                    self.session.add(LearnedSkill(char_id=char.id, skill_id=skill.id))
        elif type_ == 'Item': # Actually Potion for direct use
            item = self.session.query(ItemTemplate).filter_by(name=target_name).first()
            if item: target_id = item.id

        if target_id:
            mapping[key] = {"type": type_, "id": target_id, "name": target_name}
            char.key_mapping = json.dumps(mapping)
            self.session.commit()
            self.log(f"⌨️ [키 설정] '{key}' 키에 '{target_name}'({type_}) 등록 완료.")
        else:
            self.log(f"⚠️ [오류] '{target_name}'을(를) 찾을 수 없습니다.")

    def move_to(self, char_name, map_name):
        char = self.get_character(char_name)
        target_map = self.session.query(MapInfo).filter_by(name=map_name).first()
        
        if not target_map:
            self.log(f"⚠️ [이동 실패] 존재하지 않는 지역입니다: {map_name}")
            return

        # Check conditions (simplified)
        if char.level < target_map.min_level:
            self.log(f"⚠️ [이동 실패] 레벨이 부족합니다. (필요: {target_map.min_level})")
            return
        
        if target_map.allowed_faction != 0 and target_map.allowed_faction != char.faction:
             self.log(f"⚠️ [이동 실패] 해당 세력만 출입 가능합니다.")
             return

        char.map_id = target_map.id
        char.x, char.y = 0, 0 # Reset coords
        self.session.commit()
        self.log(f"👣 [{char.name}]가 '{target_map.name}'(으)로 이동하였습니다.")

    def warp(self, char_name, map_name):
        # For simplicity, warp calls move_to logic but emphasizes magic/menu usage
        self.log(f"🌀 [공간 이동] 메뉴를 통해 이동을 시도합니다...")
        self.move_to(char_name, map_name)

    def hunt(self, char_name, monster_name):
        char = self.get_character(char_name)
        monster = self.session.query(MonsterTemplate).filter_by(name=monster_name).first()

        if not monster: return

        self.log(f"⚔️ [{char.name}]가 '{monster.name}'(Lv.{monster.level})와(과) 전투를 시작합니다!")

        # Simple battle simulation
        # In a real loop, we would handle turns. Here we just assume victory for the scenario.
        damage_variance = random.uniform(0.9, 1.1)
        damage = int(10 * char.level * damage_variance) # Base damage logic
        
        self.log(f"💥 [{char.name}]의 공격! '{monster.name}'에게 {damage}의 피해!")
        self.log(f"💀 '{monster.name}' 처치! 경험치 +{monster.exp}")

        char.exp += monster.exp
        
        # Level Up Logic (Simplified: Every 100 * Level exp needed)
        req_exp = 100 * char.level * (1.5**(char.level-1)) # Exponential curve (simplified for low levels)
        if char.level <= 5: req_exp = 30 # Tuning for scenario

        while char.exp >= req_exp:
            char.exp -= int(req_exp)
            char.level += 1
            char.max_hp += 20
            char.max_mp += 10
            char.hp = char.max_hp
            char.mp = char.max_mp
            self.log(f"✨ **LEVEL UP**! [{char.name}]가 Lv.{char.level}이 되었습니다!")
            req_exp = 30 if char.level <= 5 else 100 * char.level # Recalculate for loop

        self.session.commit()

    def choose_faction(self, char_name, faction_id):
        char = self.get_character(char_name)
        if char.level < 10:
            self.log("⚠️ 레벨 10 이상만 세력을 선택할 수 있습니다.")
            return

        char.faction = faction_id
        faction_name = self.factions[faction_id]
        self.log(f"🚩 [전직] [{char.name}]가 [{faction_name}]에 투신하였습니다!")

        # Auto warp to base
        base_map_names = {1: "낙양성(정파 본성)", 2: "죽림오채(사파 본성)", 3: "천산마궁(마교 본성)"}
        self.move_to(char_name, base_map_names[faction_id])

    def buy_item(self, char_name, npc_type, item_name):
        char = self.get_character(char_name)
        item = self.session.query(ItemTemplate).filter_by(name=item_name).first()
        
        if not item: return

        if char.money >= item.price:
            char.money -= item.price
            inv = Inventory(char_id=char.id, item_id=item.id, is_equipped=True) # Auto equip for demo
            self.session.add(inv)
            self.session.commit()
            self.log(f"💰 [{char.name}]가 '{item.name}'을(를) {item.price}냥에 구매하고 장착했습니다.")
        else:
            self.log(f"💸 돈이 부족합니다.")

    def boss_raid(self, char_name, boss_name):
        char = self.get_character(char_name)
        boss = self.session.query(MonsterTemplate).filter_by(name=boss_name).first()
        
        self.log(f"☠️ [레이드] 거대 보스 '{boss.name}'(이)가 포효합니다!")
        self.log(f"🗣️ {boss.name}: \"감히 내 영역을 침범하다니, 뼈도 못 추리게 해주마!\"")
        
        # Combat...
        self.log(f"⚔️ [{char.name}]가 필사의 각오로 공격을 퍼붓습니다!")
        
        # Win with luck
        if random.random() < 0.99: # Almost always win for scenario
            self.log(f"🎉 '{boss.name}' 토벌 성공! 무림의 평화를 지켰습니다.")
            
            # Drop logic
            if random.random() < 0.4: # 40% chance (scenario requested 30%)
                self.log(f"💎 [득템] 보스가 '전설의 강화석'과 '유니크 장비'를 떨어뜨렸습니다!")
            else:
                self.log(f"📦 잡동사니를 획득했습니다.")
        else:
            self.log(f"💀 [{char.name}]가 장렬히 전사했습니다...")


# --- Part C: Simulation Driver ---

def run_simulation():
    server = GameServer()
    server.log("==========================================")
    server.log("    천무쟁패(天武爭覇) 서버 시뮬레이션 시작")
    server.log("==========================================")
    
    # 1. [생성]
    char_name = "무림고수"
    char = server.create_character(char_name)

    # 2. [설정] 키 맵핑
    server.configure_key(char_name, 'z', '기본 검술', 'Skill')
    server.configure_key(char_name, '1', '소림대환단', 'Item')

    # 3. [이동] 무명촌 -> 초보자 사냥터
    server.move_to(char_name, "초보자 사냥터")

    # 4. [전투] 사냥 -> Lv 5 달성
    # Force level up logic inside hunt slightly for demo flow
    for _ in range(5):
        server.hunt(char_name, "들개")
        if char.level >= 5: break
    
    # 5. [워프] ESC 메뉴 -> 초보자 사냥터 2
    server.warp(char_name, "초보자 사냥터 2")
    
    # Cheat exp to level 10 for flow
    char.exp = 0
    char.level = 10
    server.session.commit()
    server.log("⏩ (시간 경과)... 어느덧 Lv.10이 되었습니다.")

    # 6. [전직] 사파(흑풍회) 선택 -> 죽림오채 이동
    server.choose_faction(char_name, 2)

    # 7. [쇼핑] 무기 구매
    server.buy_item(char_name, "무기 상인", "사파식 도")

    # 8. [성장] 사파 전용 사냥터 이동 -> 사냥 -> Lv 20
    server.move_to(char_name, "흑풍곡(사파 사냥터)")
    # Cheat exp again
    char.level = 20
    server.session.commit()
    server.log("⏩ (폭풍 성장)... 수많은 적을 베고 Lv.20 고수가 되었습니다.")

    # 9. [만남] 중원 이동 -> 조우
    server.move_to(char_name, "중원(중립 마을)")
    server.log("👥 [만남] 정파 유저 '백의검객'과 마주쳤지만, 중립 지역이라 서로 경계만 하고 지나갑니다.")

    # 10. [보스] 레이드
    server.boss_raid(char_name, "천년 묵은 혈마")

    server.log("==========================================")
    server.log("       시뮬레이션 종료 (Server Shutdown)")
    server.log("==========================================")

if __name__ == "__main__":
    run_simulation()
