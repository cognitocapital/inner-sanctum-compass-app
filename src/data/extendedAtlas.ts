/**
 * Extended atlas regions — derived from open neuroanatomical atlases
 * (Harvard-Oxford cortical/subcortical, Julich-Brain cytoarchitectonic labels,
 * AAL3, and Yeo 7/17-network parcellations).
 *
 * These are anatomical labels only. Each entry routes back to a "parent"
 * curated region in `brainRegions.ts` for the manuscript chapter, protocol
 * link, and AI seed prompt — so the user always lands on a manuscript-tied
 * clinical card even when they tap a fine-grained label.
 *
 * Source-of-truth caveat: positions are approximated from MNI-152 centroids
 * normalised to our atlas coordinate system. Educational visualisation only.
 */
import type { BrainRegion, RegionCategory } from "./brainRegions";

export interface ExtendedRegion {
  id: string;
  label: string;
  shortLabel?: string;
  category: RegionCategory;
  /** Which curated region in brainRegions.ts inherits its protocol/AI links */
  parentId: string;
  position: [number, number, number];
  /** Open atlas this label is sourced from. */
  source: "Harvard-Oxford" | "Julich-Brain" | "AAL3" | "Yeo-7" | "JHU-DTI";
  /** Optional Brodmann or anatomical aliases for search. */
  aliases?: string[];
}

// Helpers to keep the dataset compact ----------------------------------------
const cort = (
  id: string,
  label: string,
  parentId: string,
  pos: [number, number, number],
  source: ExtendedRegion["source"] = "Harvard-Oxford",
  aliases?: string[]
): ExtendedRegion => ({
  id, label, parentId, position: pos, source, aliases, category: "cortical",
});
const sub = (
  id: string,
  label: string,
  parentId: string,
  pos: [number, number, number],
  source: ExtendedRegion["source"] = "Harvard-Oxford",
  aliases?: string[]
): ExtendedRegion => ({
  id, label, parentId, position: pos, source, aliases, category: "subcortical",
});
const net = (
  id: string,
  label: string,
  parentId: string,
  pos: [number, number, number],
  source: ExtendedRegion["source"] = "Yeo-7",
  aliases?: string[]
): ExtendedRegion => ({
  id, label, parentId, position: pos, source, aliases, category: "network",
});
const stem = (
  id: string,
  label: string,
  parentId: string,
  pos: [number, number, number],
  source: ExtendedRegion["source"] = "Harvard-Oxford",
  aliases?: string[]
): ExtendedRegion => ({
  id, label, parentId, position: pos, source, aliases, category: "brainstem",
});

// ============================================================================
// FRONTAL — 36 sublabels (Harvard-Oxford + Julich)
// ============================================================================
const frontal: ExtendedRegion[] = [
  cort("ho_frontal_pole_l", "Frontal Pole (L)", "dlpfc", [-0.85, 0.65, 1.15], "Harvard-Oxford", ["BA10", "rostral PFC"]),
  cort("ho_frontal_pole_r", "Frontal Pole (R)", "dlpfc", [0.85, 0.65, 1.15]),
  cort("ho_sfg_l", "Superior Frontal Gyrus (L)", "dlpfc", [-0.45, 0.85, 0.85], "Harvard-Oxford", ["BA8", "BA9"]),
  cort("ho_sfg_r", "Superior Frontal Gyrus (R)", "dlpfc", [0.45, 0.85, 0.85]),
  cort("ho_mfg_l", "Middle Frontal Gyrus (L)", "dlpfc", [-0.95, 0.55, 0.95], "Harvard-Oxford", ["BA46"]),
  cort("ho_mfg_r", "Middle Frontal Gyrus (R)", "dlpfc", [0.95, 0.55, 0.95]),
  cort("ho_ifg_pars_tri_l", "IFG pars triangularis (L)", "temporal", [-1.05, 0.3, 0.95], "Harvard-Oxford", ["Broca", "BA45"]),
  cort("ho_ifg_pars_tri_r", "IFG pars triangularis (R)", "temporal", [1.05, 0.3, 0.95]),
  cort("ho_ifg_pars_oper_l", "IFG pars opercularis (L)", "temporal", [-1.1, 0.4, 0.65], "Harvard-Oxford", ["BA44"]),
  cort("ho_ifg_pars_oper_r", "IFG pars opercularis (R)", "temporal", [1.1, 0.4, 0.65]),
  cort("ho_precentral_l", "Precentral Gyrus (L)", "motor", [-0.95, 0.95, 0.2], "Harvard-Oxford", ["M1", "BA4"]),
  cort("ho_precentral_r", "Precentral Gyrus (R)", "motor", [0.95, 0.95, 0.2]),
  cort("ho_sma_l", "Supplementary Motor Area (L)", "motor", [-0.2, 0.95, 0.55], "Harvard-Oxford", ["SMA", "BA6"]),
  cort("ho_sma_r", "Supplementary Motor Area (R)", "motor", [0.2, 0.95, 0.55]),
  cort("ho_premotor_l", "Premotor Cortex (L)", "motor", [-0.85, 0.85, 0.55], "Harvard-Oxford", ["BA6"]),
  cort("ho_premotor_r", "Premotor Cortex (R)", "motor", [0.85, 0.85, 0.55]),
  cort("ho_fef_l", "Frontal Eye Field (L)", "ecn", [-0.7, 0.75, 0.7], "Julich-Brain", ["FEF", "BA8"]),
  cort("ho_fef_r", "Frontal Eye Field (R)", "ecn", [0.7, 0.75, 0.7]),
  cort("ho_paracingulate_l", "Paracingulate Gyrus (L)", "acc", [-0.15, 0.7, 0.75]),
  cort("ho_paracingulate_r", "Paracingulate Gyrus (R)", "acc", [0.15, 0.7, 0.75]),
  cort("ho_subcallosal_l", "Subcallosal Cortex (L)", "vmpfc", [-0.1, -0.2, 0.95], "Harvard-Oxford", ["BA25"]),
  cort("ho_subcallosal_r", "Subcallosal Cortex (R)", "vmpfc", [0.1, -0.2, 0.95]),
  cort("ho_frontal_orb_l", "Frontal Orbital Cortex (L)", "ofc", [-0.55, -0.1, 1.05], "Harvard-Oxford", ["BA47"]),
  cort("ho_frontal_orb_r", "Frontal Orbital Cortex (R)", "ofc", [0.55, -0.1, 1.05]),
  cort("ho_frontal_med_l", "Frontal Medial Cortex (L)", "vmpfc", [-0.1, 0.2, 1.15], "Harvard-Oxford", ["mPFC"]),
  cort("ho_frontal_med_r", "Frontal Medial Cortex (R)", "vmpfc", [0.1, 0.2, 1.15]),
  cort("ho_dlpfc_lat_l", "DLPFC lateral (L)", "dlpfc", [-1.1, 0.55, 0.85], "Julich-Brain", ["BA9/46"]),
  cort("ho_dlpfc_lat_r", "DLPFC lateral (R)", "dlpfc", [1.1, 0.55, 0.85]),
  cort("ho_dlpfc_caudal_l", "Caudal DLPFC (L)", "dlpfc", [-0.85, 0.7, 0.55], "Julich-Brain"),
  cort("ho_dlpfc_caudal_r", "Caudal DLPFC (R)", "dlpfc", [0.85, 0.7, 0.55]),
  cort("ho_acc_dorsal_l", "Dorsal ACC (L)", "acc", [-0.05, 0.6, 0.65], "Julich-Brain", ["dACC"]),
  cort("ho_acc_dorsal_r", "Dorsal ACC (R)", "acc", [0.05, 0.6, 0.65]),
  cort("ho_acc_rostral_l", "Rostral ACC (L)", "acc", [-0.05, 0.5, 0.95], "Julich-Brain", ["rACC", "pgACC"]),
  cort("ho_acc_rostral_r", "Rostral ACC (R)", "acc", [0.05, 0.5, 0.95]),
  cort("ho_acc_subgenual_l", "Subgenual ACC (L)", "vmpfc", [-0.05, 0.05, 1.05], "Julich-Brain", ["sgACC", "BA25"]),
  cort("ho_acc_subgenual_r", "Subgenual ACC (R)", "vmpfc", [0.05, 0.05, 1.05]),
];

// ============================================================================
// PARIETAL — 22
// ============================================================================
const parietal: ExtendedRegion[] = [
  cort("ho_postcentral_l", "Postcentral Gyrus (L)", "somatosensory", [-0.95, 0.95, -0.05], "Harvard-Oxford", ["S1", "BA3"]),
  cort("ho_postcentral_r", "Postcentral Gyrus (R)", "somatosensory", [0.95, 0.95, -0.05]),
  cort("ho_spl_l", "Superior Parietal Lobule (L)", "parietal", [-0.55, 0.95, -0.45], "Harvard-Oxford", ["BA5", "BA7"]),
  cort("ho_spl_r", "Superior Parietal Lobule (R)", "parietal", [0.55, 0.95, -0.45]),
  cort("ho_supramarginal_l", "Supramarginal Gyrus (L)", "parietal", [-1.1, 0.6, -0.35], "Harvard-Oxford", ["BA40"]),
  cort("ho_supramarginal_r", "Supramarginal Gyrus (R)", "parietal", [1.1, 0.6, -0.35]),
  cort("ho_angular_l", "Angular Gyrus (L)", "dmn", [-1.05, 0.55, -0.75], "Harvard-Oxford", ["BA39"]),
  cort("ho_angular_r", "Angular Gyrus (R)", "dmn", [1.05, 0.55, -0.75]),
  cort("ho_precuneus_l", "Precuneus (L)", "dmn", [-0.15, 0.85, -0.85], "Harvard-Oxford", ["BA7"]),
  cort("ho_precuneus_r", "Precuneus (R)", "dmn", [0.15, 0.85, -0.85]),
  cort("ho_pcc_l", "Posterior Cingulate (L)", "dmn", [-0.1, 0.55, -0.45], "Harvard-Oxford", ["PCC", "BA23"]),
  cort("ho_pcc_r", "Posterior Cingulate (R)", "dmn", [0.1, 0.55, -0.45]),
  cort("ho_central_oper_l", "Central Operculum (L)", "insula", [-1.05, 0.4, 0.05]),
  cort("ho_central_oper_r", "Central Operculum (R)", "insula", [1.05, 0.4, 0.05]),
  cort("ho_parietal_oper_l", "Parietal Operculum (L)", "somatosensory", [-1.0, 0.55, -0.25]),
  cort("ho_parietal_oper_r", "Parietal Operculum (R)", "somatosensory", [1.0, 0.55, -0.25]),
  cort("ho_ips_l", "Intraparietal Sulcus (L)", "ecn", [-0.85, 0.85, -0.45], "Julich-Brain", ["IPS"]),
  cort("ho_ips_r", "Intraparietal Sulcus (R)", "ecn", [0.85, 0.85, -0.45]),
  cort("ho_tpj_l", "Temporo-Parietal Junction (L)", "salience", [-1.15, 0.45, -0.45], "Julich-Brain", ["TPJ"]),
  cort("ho_tpj_r", "Temporo-Parietal Junction (R)", "salience", [1.15, 0.45, -0.45]),
  cort("ho_cingulate_post_l", "Posterior Mid-Cingulate (L)", "acc", [-0.05, 0.7, -0.15]),
  cort("ho_cingulate_post_r", "Posterior Mid-Cingulate (R)", "acc", [0.05, 0.7, -0.15]),
];

// ============================================================================
// TEMPORAL — 28
// ============================================================================
const temporal: ExtendedRegion[] = [
  cort("ho_temporal_pole_l", "Temporal Pole (L)", "temporal", [-1.0, -0.05, 0.95], "Harvard-Oxford", ["BA38"]),
  cort("ho_temporal_pole_r", "Temporal Pole (R)", "temporal", [1.0, -0.05, 0.95]),
  cort("ho_stg_ant_l", "Anterior Sup. Temporal Gyrus (L)", "temporal", [-1.2, 0.05, 0.55], "Harvard-Oxford", ["aSTG"]),
  cort("ho_stg_ant_r", "Anterior Sup. Temporal Gyrus (R)", "temporal", [1.2, 0.05, 0.55]),
  cort("ho_stg_post_l", "Posterior Sup. Temporal Gyrus (L)", "temporal", [-1.25, 0.15, -0.05], "Harvard-Oxford", ["pSTG"]),
  cort("ho_stg_post_r", "Posterior Sup. Temporal Gyrus (R)", "temporal", [1.25, 0.15, -0.05]),
  cort("ho_mtg_ant_l", "Anterior Middle Temporal Gyrus (L)", "temporal", [-1.25, -0.15, 0.55], "Harvard-Oxford", ["aMTG"]),
  cort("ho_mtg_ant_r", "Anterior Middle Temporal Gyrus (R)", "temporal", [1.25, -0.15, 0.55]),
  cort("ho_mtg_post_l", "Posterior Middle Temporal Gyrus (L)", "temporal", [-1.3, -0.05, -0.15]),
  cort("ho_mtg_post_r", "Posterior Middle Temporal Gyrus (R)", "temporal", [1.3, -0.05, -0.15]),
  cort("ho_mtg_temp_occ_l", "MTG temporo-occipital (L)", "occipital", [-1.2, 0.05, -0.55]),
  cort("ho_mtg_temp_occ_r", "MTG temporo-occipital (R)", "occipital", [1.2, 0.05, -0.55]),
  cort("ho_itg_ant_l", "Anterior Inferior Temporal Gyrus (L)", "temporal", [-1.2, -0.4, 0.55]),
  cort("ho_itg_ant_r", "Anterior Inferior Temporal Gyrus (R)", "temporal", [1.2, -0.4, 0.55]),
  cort("ho_itg_post_l", "Posterior Inferior Temporal Gyrus (L)", "temporal", [-1.25, -0.35, -0.15]),
  cort("ho_itg_post_r", "Posterior Inferior Temporal Gyrus (R)", "temporal", [1.25, -0.35, -0.15]),
  cort("ho_fusiform_l", "Fusiform Gyrus (L)", "temporal", [-0.95, -0.45, -0.25], "Harvard-Oxford", ["FFA", "BA37"]),
  cort("ho_fusiform_r", "Fusiform Gyrus (R)", "temporal", [0.95, -0.45, -0.25]),
  cort("ho_parahippocampal_ant_l", "Anterior Parahippocampal Gyrus (L)", "hippocampus", [-0.6, -0.4, 0.25]),
  cort("ho_parahippocampal_ant_r", "Anterior Parahippocampal Gyrus (R)", "hippocampus", [0.6, -0.4, 0.25]),
  cort("ho_parahippocampal_post_l", "Posterior Parahippocampal Gyrus (L)", "hippocampus", [-0.55, -0.35, -0.25]),
  cort("ho_parahippocampal_post_r", "Posterior Parahippocampal Gyrus (R)", "hippocampus", [0.55, -0.35, -0.25]),
  cort("ho_heschl_l", "Heschl's Gyrus (L)", "temporal", [-0.85, 0.25, 0.05], "Harvard-Oxford", ["A1", "primary auditory"]),
  cort("ho_heschl_r", "Heschl's Gyrus (R)", "temporal", [0.85, 0.25, 0.05]),
  cort("ho_planum_temp_l", "Planum Temporale (L)", "temporal", [-1.0, 0.3, -0.15]),
  cort("ho_planum_temp_r", "Planum Temporale (R)", "temporal", [1.0, 0.3, -0.15]),
  cort("ho_planum_pol_l", "Planum Polare (L)", "temporal", [-0.95, 0.05, 0.3]),
  cort("ho_planum_pol_r", "Planum Polare (R)", "temporal", [0.95, 0.05, 0.3]),
];

// ============================================================================
// OCCIPITAL — 18
// ============================================================================
const occipital: ExtendedRegion[] = [
  cort("ho_lateral_occ_sup_l", "Sup. Lateral Occipital (L)", "occipital", [-0.85, 0.55, -0.95]),
  cort("ho_lateral_occ_sup_r", "Sup. Lateral Occipital (R)", "occipital", [0.85, 0.55, -0.95]),
  cort("ho_lateral_occ_inf_l", "Inf. Lateral Occipital (L)", "occipital", [-0.95, -0.05, -0.95]),
  cort("ho_lateral_occ_inf_r", "Inf. Lateral Occipital (R)", "occipital", [0.95, -0.05, -0.95]),
  cort("ho_intracalcarine_l", "Intracalcarine Cortex (L)", "occipital", [-0.15, 0.05, -1.15], "Harvard-Oxford", ["V1", "BA17"]),
  cort("ho_intracalcarine_r", "Intracalcarine Cortex (R)", "occipital", [0.15, 0.05, -1.15]),
  cort("ho_supracalcarine_l", "Supracalcarine Cortex (L)", "occipital", [-0.15, 0.4, -1.1]),
  cort("ho_supracalcarine_r", "Supracalcarine Cortex (R)", "occipital", [0.15, 0.4, -1.1]),
  cort("ho_cuneal_l", "Cuneal Cortex (L)", "occipital", [-0.2, 0.55, -1.0]),
  cort("ho_cuneal_r", "Cuneal Cortex (R)", "occipital", [0.2, 0.55, -1.0]),
  cort("ho_lingual_l", "Lingual Gyrus (L)", "occipital", [-0.25, -0.25, -0.95], "Harvard-Oxford", ["V2", "BA18"]),
  cort("ho_lingual_r", "Lingual Gyrus (R)", "occipital", [0.25, -0.25, -0.95]),
  cort("ho_occipital_pole_l", "Occipital Pole (L)", "occipital", [-0.25, 0.1, -1.3]),
  cort("ho_occipital_pole_r", "Occipital Pole (R)", "occipital", [0.25, 0.1, -1.3]),
  cort("ho_occipital_fusiform_l", "Occipital Fusiform (L)", "occipital", [-0.55, -0.3, -0.85]),
  cort("ho_occipital_fusiform_r", "Occipital Fusiform (R)", "occipital", [0.55, -0.3, -0.85]),
  cort("ho_v5_mt_l", "V5 / MT+ (L)", "occipital", [-0.95, 0.25, -0.75], "Julich-Brain", ["motion area"]),
  cort("ho_v5_mt_r", "V5 / MT+ (R)", "occipital", [0.95, 0.25, -0.75]),
];

// ============================================================================
// INSULA — 8
// ============================================================================
const insulaSubs: ExtendedRegion[] = [
  cort("ho_insula_ant_l", "Anterior Insula (L)", "insula", [-0.95, 0.1, 0.55], "Julich-Brain", ["aINS"]),
  cort("ho_insula_ant_r", "Anterior Insula (R)", "insula", [0.95, 0.1, 0.55]),
  cort("ho_insula_mid_l", "Mid Insula (L)", "insula", [-1.0, 0.05, 0.4]),
  cort("ho_insula_mid_r", "Mid Insula (R)", "insula", [1.0, 0.05, 0.4]),
  cort("ho_insula_post_l", "Posterior Insula (L)", "insula", [-1.0, 0.0, 0.2], "Julich-Brain", ["pINS"]),
  cort("ho_insula_post_r", "Posterior Insula (R)", "insula", [1.0, 0.0, 0.2]),
  cort("ho_frontal_oper_l", "Frontal Operculum (L)", "insula", [-1.05, 0.35, 0.45]),
  cort("ho_frontal_oper_r", "Frontal Operculum (R)", "insula", [1.05, 0.35, 0.45]),
];

// ============================================================================
// SUBCORTICAL — 30
// ============================================================================
const subcortical: ExtendedRegion[] = [
  sub("ho_caudate_l", "Caudate Nucleus (L)", "basal_ganglia", [-0.35, 0.2, 0.25], "Harvard-Oxford"),
  sub("ho_caudate_r", "Caudate Nucleus (R)", "basal_ganglia", [0.35, 0.2, 0.25]),
  sub("ho_putamen_l", "Putamen (L)", "basal_ganglia", [-0.5, -0.05, 0.2]),
  sub("ho_putamen_r", "Putamen (R)", "basal_ganglia", [0.5, -0.05, 0.2]),
  sub("ho_pallidum_l", "Globus Pallidus (L)", "basal_ganglia", [-0.4, -0.05, 0.15]),
  sub("ho_pallidum_r", "Globus Pallidus (R)", "basal_ganglia", [0.4, -0.05, 0.15]),
  sub("ho_nuc_accumbens_l", "Nucleus Accumbens (L)", "basal_ganglia", [-0.2, -0.15, 0.3], "Harvard-Oxford", ["NAc", "ventral striatum"]),
  sub("ho_nuc_accumbens_r", "Nucleus Accumbens (R)", "basal_ganglia", [0.2, -0.15, 0.3]),
  sub("ho_thalamus_ant_l", "Anterior Thalamus (L)", "thalamus", [-0.25, 0.25, 0.15]),
  sub("ho_thalamus_ant_r", "Anterior Thalamus (R)", "thalamus", [0.25, 0.25, 0.15]),
  sub("ho_thalamus_md_l", "Mediodorsal Thalamus (L)", "thalamus", [-0.2, 0.2, 0.0], "Julich-Brain", ["MD"]),
  sub("ho_thalamus_md_r", "Mediodorsal Thalamus (R)", "thalamus", [0.2, 0.2, 0.0]),
  sub("ho_thalamus_pulvinar_l", "Pulvinar (L)", "thalamus", [-0.3, 0.2, -0.2]),
  sub("ho_thalamus_pulvinar_r", "Pulvinar (R)", "thalamus", [0.3, 0.2, -0.2]),
  sub("ho_thalamus_lgn_l", "Lateral Geniculate Nucleus (L)", "thalamus", [-0.4, 0.05, -0.25], "Julich-Brain", ["LGN"]),
  sub("ho_thalamus_lgn_r", "Lateral Geniculate Nucleus (R)", "thalamus", [0.4, 0.05, -0.25]),
  sub("ho_thalamus_mgn_l", "Medial Geniculate Nucleus (L)", "thalamus", [-0.3, 0.05, -0.2], "Julich-Brain", ["MGN"]),
  sub("ho_thalamus_mgn_r", "Medial Geniculate Nucleus (R)", "thalamus", [0.3, 0.05, -0.2]),
  sub("ho_amygdala_basolat_l", "Basolateral Amygdala (L)", "amygdala", [-0.5, -0.2, 0.4], "Julich-Brain", ["BLA"]),
  sub("ho_amygdala_basolat_r", "Basolateral Amygdala (R)", "amygdala", [0.5, -0.2, 0.4]),
  sub("ho_amygdala_centromedial_l", "Centromedial Amygdala (L)", "amygdala", [-0.45, -0.15, 0.35]),
  sub("ho_amygdala_centromedial_r", "Centromedial Amygdala (R)", "amygdala", [0.45, -0.15, 0.35]),
  sub("ho_hippo_ca1_l", "Hippocampus CA1 (L)", "hippocampus", [-0.6, -0.25, 0.05], "Julich-Brain"),
  sub("ho_hippo_ca1_r", "Hippocampus CA1 (R)", "hippocampus", [0.6, -0.25, 0.05]),
  sub("ho_hippo_ca3_l", "Hippocampus CA3 / DG (L)", "hippocampus", [-0.55, -0.2, 0.0]),
  sub("ho_hippo_ca3_r", "Hippocampus CA3 / DG (R)", "hippocampus", [0.55, -0.2, 0.0]),
  sub("ho_hippo_subiculum_l", "Subiculum (L)", "hippocampus", [-0.55, -0.3, -0.05]),
  sub("ho_hippo_subiculum_r", "Subiculum (R)", "hippocampus", [0.55, -0.3, -0.05]),
  sub("ho_septal_nuc", "Septal Nuclei", "hypothalamus", [0.0, 0.05, 0.35]),
  sub("ho_mammillary", "Mammillary Bodies", "hypothalamus", [0.0, -0.15, 0.15]),
];

// ============================================================================
// BRAINSTEM & CEREBELLUM — 22
// ============================================================================
const brainstemRegions: ExtendedRegion[] = [
  stem("ho_midbrain", "Midbrain", "brainstem", [0.0, -0.5, -0.2]),
  stem("ho_pag", "Periaqueductal Gray", "brainstem", [0.0, -0.45, -0.3], "AAL3", ["PAG"]),
  stem("ho_red_nucleus_l", "Red Nucleus (L)", "brainstem", [-0.1, -0.55, -0.25]),
  stem("ho_red_nucleus_r", "Red Nucleus (R)", "brainstem", [0.1, -0.55, -0.25]),
  stem("ho_substantia_nigra_l", "Substantia Nigra (L)", "basal_ganglia", [-0.15, -0.55, -0.15], "AAL3", ["SN"]),
  stem("ho_substantia_nigra_r", "Substantia Nigra (R)", "basal_ganglia", [0.15, -0.55, -0.15]),
  stem("ho_subthalamic_l", "Subthalamic Nucleus (L)", "basal_ganglia", [-0.18, -0.35, -0.05], "AAL3", ["STN"]),
  stem("ho_subthalamic_r", "Subthalamic Nucleus (R)", "basal_ganglia", [0.18, -0.35, -0.05]),
  stem("ho_pons", "Pons", "brainstem", [0.0, -0.85, -0.45]),
  stem("ho_medulla", "Medulla Oblongata", "brainstem", [0.0, -1.05, -0.45]),
  stem("ho_locus_coeruleus", "Locus Coeruleus", "brainstem", [0.0, -0.75, -0.55], "AAL3", ["LC"]),
  stem("ho_raphe", "Raphe Nuclei", "brainstem", [0.0, -0.8, -0.5]),
  stem("ho_vestibular_l", "Vestibular Nucleus (L)", "vestibular", [-0.2, -0.75, -0.55]),
  stem("ho_vestibular_r", "Vestibular Nucleus (R)", "vestibular", [0.2, -0.75, -0.55]),
  stem("ho_cerebellum_lobule_i_iv_l", "Cerebellum Lobule I-IV (L)", "cerebellum", [-0.35, -0.7, -0.65]),
  stem("ho_cerebellum_lobule_i_iv_r", "Cerebellum Lobule I-IV (R)", "cerebellum", [0.35, -0.7, -0.65]),
  stem("ho_cerebellum_lobule_vi_l", "Cerebellum Lobule VI (L)", "cerebellum", [-0.55, -0.85, -0.85]),
  stem("ho_cerebellum_lobule_vi_r", "Cerebellum Lobule VI (R)", "cerebellum", [0.55, -0.85, -0.85]),
  stem("ho_cerebellum_crus_i_l", "Cerebellum Crus I (L)", "cerebellum", [-0.7, -0.95, -0.95]),
  stem("ho_cerebellum_crus_i_r", "Cerebellum Crus I (R)", "cerebellum", [0.7, -0.95, -0.95]),
  stem("ho_cerebellum_vermis", "Cerebellar Vermis", "cerebellum", [0.0, -0.9, -0.85]),
  stem("ho_cerebellum_flocculus", "Flocculonodular Lobe", "vestibular", [0.0, -0.85, -1.05]),
];

// ============================================================================
// NETWORKS & TRACTS (Yeo / JHU-DTI) — 12
// ============================================================================
const networks: ExtendedRegion[] = [
  net("yeo_dmn_mpfc", "DMN — Medial PFC node", "dmn", [0.0, 0.55, 0.95]),
  net("yeo_dmn_pcc", "DMN — PCC node", "dmn", [0.0, 0.55, -0.45]),
  net("yeo_dmn_angular_l", "DMN — Angular (L)", "dmn", [-1.05, 0.55, -0.75]),
  net("yeo_dmn_angular_r", "DMN — Angular (R)", "dmn", [1.05, 0.55, -0.75]),
  net("yeo_salience_ains_l", "Salience — Ant. Insula (L)", "salience", [-0.95, 0.1, 0.55]),
  net("yeo_salience_ains_r", "Salience — Ant. Insula (R)", "salience", [0.95, 0.1, 0.55]),
  net("yeo_salience_dacc", "Salience — dACC node", "salience", [0.0, 0.6, 0.55]),
  net("yeo_ecn_dlpfc_l", "ECN — DLPFC (L)", "ecn", [-0.95, 0.55, 0.85]),
  net("yeo_ecn_dlpfc_r", "ECN — DLPFC (R)", "ecn", [0.95, 0.55, 0.85]),
  net("yeo_dan_fef", "Dorsal Attention — FEF", "ecn", [0.0, 0.75, 0.7], "Yeo-7", ["DAN"]),
  net("jhu_corpus_callosum", "Corpus Callosum (DTI)", "ecn", [0.0, 0.45, 0.05], "JHU-DTI"),
  net("jhu_uncinate_l", "Uncinate Fasciculus (L)", "ofc", [-0.6, -0.1, 0.7], "JHU-DTI"),
];

// ============================================================================
// FINAL EXPORTED LIST
// ============================================================================
export const extendedAtlasRegions: ExtendedRegion[] = [
  ...frontal,
  ...parietal,
  ...temporal,
  ...occipital,
  ...insulaSubs,
  ...subcortical,
  ...brainstemRegions,
  ...networks,
];

/** Look up the curated parent region for any extended-atlas entry. */
export function getParentRegion(
  extendedId: string,
  curated: BrainRegion[]
): BrainRegion | null {
  const ext = extendedAtlasRegions.find((r) => r.id === extendedId);
  if (!ext) return null;
  return curated.find((c) => c.id === ext.parentId) ?? null;
}

export const EXTENDED_ATLAS_VERSION = "2026.04.1";
